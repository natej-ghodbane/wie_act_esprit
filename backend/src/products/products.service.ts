import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { StockMovement, StockMovementDocument } from './schemas/stock-movement.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StockAdjustmentDto, BulkStockUpdateDto, StockMovementQueryDto, LowStockThresholdDto } from './dto/stock-management.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(StockMovement.name) private readonly stockMovementModel: Model<StockMovementDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  // Get all products with optional filters
  async findAll(filters?: FilterQuery<ProductDocument>) {
    const query = filters ? { ...filters, isActive: true } : { isActive: true };
    
    // Convert marketplaceId to ObjectId if it's a string
    if (query.marketplaceId && typeof query.marketplaceId === 'string') {
      query.marketplaceId = new Types.ObjectId(query.marketplaceId);
    }
    
    return this.productModel.find(query).lean();
  }

  // Get single product by ID
  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }
    
    const product = await this.productModel.findById(id).lean();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // Create new product
  async create(vendorId: string, createProductDto: CreateProductDto) {
    // Validate marketplace ID
    if (!Types.ObjectId.isValid(createProductDto.marketplaceId)) {
      throw new BadRequestException('Invalid marketplace ID');
    }

    const product = new this.productModel({
      ...createProductDto,
      vendorId: new Types.ObjectId(vendorId),
      marketplaceId: new Types.ObjectId(createProductDto.marketplaceId),
    });

    return product.save();
  }

  // Update product
  async update(id: string, vendorId: string, updateProductDto: UpdateProductDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check ownership
    if (product.vendorId.toString() !== vendorId) {
      throw new ForbiddenException('You do not have permission to update this product');
    }

    // Convert marketplaceId to ObjectId if provided
    if (updateProductDto.marketplaceId) {
      if (!Types.ObjectId.isValid(updateProductDto.marketplaceId)) {
        throw new BadRequestException('Invalid marketplace ID');
      }
      Object.assign(product, {
        ...updateProductDto,
        marketplaceId: new Types.ObjectId(updateProductDto.marketplaceId),
      });
    } else {
      Object.assign(product, updateProductDto);
    }

    return product.save();
  }

  // Delete product
  async delete(id: string, vendorId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check ownership
    if (product.vendorId.toString() !== vendorId) {
      throw new ForbiddenException('You do not have permission to delete this product');
    }

    await product.deleteOne();
    return { message: 'Product deleted successfully' };
  }

  // Stock Management Methods
  async adjustStock(productId: string, userId: string, stockAdjustmentDto: StockAdjustmentDto) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check ownership
    if (product.vendorId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to update this product');
    }

    const previousQuantity = product.inventory;
    const newQuantity = stockAdjustmentDto.newQuantity;
    const change = newQuantity - previousQuantity;

    // Update product inventory
    product.inventory = newQuantity;
    await product.save();

    // Record stock movement
    const stockMovement = new this.stockMovementModel({
      productId: new Types.ObjectId(productId),
      userId: new Types.ObjectId(userId),
      previousQuantity,
      newQuantity,
      change,
      reason: stockAdjustmentDto.reason,
      notes: stockAdjustmentDto.notes,
    });
    await stockMovement.save();

    // Handle notifications
    await this.handleStockNotifications(userId, product, previousQuantity, newQuantity);

    return {
      product: await this.productModel.findById(productId).lean(),
      stockMovement: stockMovement.toObject(),
    };
  }

  async bulkUpdateStock(userId: string, bulkStockUpdateDto: BulkStockUpdateDto) {
    const results = [];
    const errors = [];

    for (const update of bulkStockUpdateDto.updates) {
      try {
        const result = await this.adjustStock(update.productId, userId, {
          newQuantity: update.newQuantity,
          reason: update.reason,
          notes: update.notes,
        });
        results.push(result);
      } catch (error) {
        errors.push({
          productId: update.productId,
          error: error.message,
        });
      }
    }

    return { results, errors };
  }

  async getStockMovements(userId: string, query: StockMovementQueryDto) {
    const filter: any = { userId: new Types.ObjectId(userId) };
    
    if (query.productId) {
      if (!Types.ObjectId.isValid(query.productId)) {
        throw new BadRequestException('Invalid product ID');
      }
      filter.productId = new Types.ObjectId(query.productId);
    }

    if (query.reason) {
      filter.reason = query.reason;
    }

    return this.stockMovementModel
      .find(filter)
      .populate('productId', 'title images')
      .sort({ createdAt: -1 })
      .limit(query.limit || 50)
      .skip(query.offset || 0)
      .lean();
  }

  async updateLowStockThreshold(productId: string, userId: string, thresholdDto: LowStockThresholdDto) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check ownership
    if (product.vendorId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to update this product');
    }

    product.lowStockThreshold = thresholdDto.threshold;
    await product.save();

    return product.toObject();
  }

  async getLowStockProducts(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    
    return this.productModel
      .find({
        vendorId: userObjectId,
        isActive: true,
        enableLowStockAlerts: true,
        $expr: { $lte: ['$inventory', '$lowStockThreshold'] }
      })
      .sort({ inventory: 1 })
      .lean();
  }

  async getStockAnalytics(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    
    const [totalProducts, lowStockProducts, outOfStockProducts, totalInventory] = await Promise.all([
      this.productModel.countDocuments({ vendorId: userObjectId, isActive: true }),
      this.productModel.countDocuments({
        vendorId: userObjectId,
        isActive: true,
        enableLowStockAlerts: true,
        $expr: { $lte: ['$inventory', '$lowStockThreshold'] }
      }),
      this.productModel.countDocuments({
        vendorId: userObjectId,
        isActive: true,
        inventory: 0
      }),
      this.productModel.aggregate([
        { $match: { vendorId: userObjectId, isActive: true } },
        { $group: { _id: null, total: { $sum: '$inventory' } } }
      ]).then(result => result[0]?.total || 0)
    ]);

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalInventory,
      averageInventoryPerProduct: totalProducts > 0 ? Math.round(totalInventory / totalProducts) : 0
    };
  }

  private async handleStockNotifications(userId: string, product: ProductDocument, previousQuantity: number, newQuantity: number) {
    if (!product.enableLowStockAlerts) return;

    const threshold = product.lowStockThreshold;
    const wasLowStock = previousQuantity <= threshold && previousQuantity > 0;
    const isNowLowStock = newQuantity <= threshold && newQuantity > 0;
    const wasOutOfStock = previousQuantity === 0;
    const isNowOutOfStock = newQuantity === 0;
    const wasRestocked = previousQuantity < newQuantity && previousQuantity <= threshold;

    try {
      // Out of stock notification
      if (!wasOutOfStock && isNowOutOfStock) {
        await this.notificationsService.createOutOfStockAlert(
          userId,
          product._id.toString(),
          product.title
        );
      }
      // Low stock notification (only if not previously low stock)
      else if (!wasLowStock && isNowLowStock && !isNowOutOfStock) {
        await this.notificationsService.createLowStockAlert(
          userId,
          product._id.toString(),
          product.title,
          newQuantity,
          threshold
        );
      }
      // Restock notification
      else if (wasRestocked && newQuantity > threshold) {
        await this.notificationsService.createRestockAlert(
          userId,
          product._id.toString(),
          product.title,
          newQuantity
        );
      }
    } catch (error) {
      // Don't fail the stock update if notification fails
      console.error('Failed to create stock notification:', error);
    }
  }
}
