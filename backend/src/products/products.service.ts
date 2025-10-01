import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
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
}
