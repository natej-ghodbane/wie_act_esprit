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
    
    // Convert vendorId to ObjectId if it's a string
    if (query.vendorId && typeof query.vendorId === 'string') {
      query.vendorId = new Types.ObjectId(query.vendorId);
    }
    
    // Convert marketplaceId to ObjectId if it's a string
    if (query.marketplaceId && typeof query.marketplaceId === 'string') {
      query.marketplaceId = new Types.ObjectId(query.marketplaceId);
    }
    
    console.log('Finding products with query:', JSON.stringify(query, null, 2));
    const products = await this.productModel.find(query).lean();
    console.log('Found products:', products.length);
    console.log('Products vendorIds:', products.map(p => ({ id: p._id, vendorId: p.vendorId })));
    return products;
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
    console.log('=== CREATING PRODUCT ===');
    console.log('VendorId received:', vendorId);
    console.log('CreateProductDto:', createProductDto);
    
    // Validate marketplace ID
    if (!Types.ObjectId.isValid(createProductDto.marketplaceId)) {
      throw new BadRequestException('Invalid marketplace ID');
    }

    const vendorObjectId = new Types.ObjectId(vendorId);
    console.log('VendorId as ObjectId:', vendorObjectId);

    const product = new this.productModel({
      ...createProductDto,
      vendorId: vendorObjectId,
      marketplaceId: new Types.ObjectId(createProductDto.marketplaceId),
    });

    const savedProduct = await product.save();
    console.log('Product saved with vendorId:', savedProduct.vendorId);
    console.log('Product saved with _id:', savedProduct._id);
    return savedProduct;
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
