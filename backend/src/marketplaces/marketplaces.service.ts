import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Marketplace, MarketplaceDocument } from './schemas/marketplace.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { CreateMarketplaceDto } from './dto/create-marketplace.dto';
import { UpdateMarketplaceDto } from './dto/update-marketplace.dto';

@Injectable()
export class MarketplacesService {
  constructor(
    @InjectModel(Marketplace.name) private readonly marketplaceModel: Model<MarketplaceDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  // Get all active marketplaces
  async findAll() {
    const marketplaces = await this.marketplaceModel.find({ isActive: true }).lean();
    
    // Get product counts for each marketplace
    const marketplacesWithCounts = await Promise.all(
      marketplaces.map(async (marketplace) => {
        const productsCount = await this.productModel.countDocuments({ 
          marketplaceId: marketplace._id 
        });
        return { ...marketplace, productsCount };
      })
    );
    
    return marketplacesWithCounts;
  }

  // Get marketplaces by vendor ID
  async findByVendor(vendorId: string) {
    const marketplaces = await this.marketplaceModel.find({ 
      vendorId: new Types.ObjectId(vendorId) 
    }).lean();
    
    const marketplacesWithCounts = await Promise.all(
      marketplaces.map(async (marketplace) => {
        const productsCount = await this.productModel.countDocuments({ 
          marketplaceId: marketplace._id 
        });
        return { ...marketplace, productsCount };
      })
    );
    
    return marketplacesWithCounts;
  }

  // Get single marketplace by ID
  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid marketplace ID');
    }
    
    const marketplace = await this.marketplaceModel.findById(id).lean();
    if (!marketplace) {
      throw new NotFoundException('Marketplace not found');
    }
    return marketplace;
  }

  // Get marketplace by slug
  async findBySlug(slug: string) {
    return this.marketplaceModel.findOne({ slug }).lean();
  }

  // Create new marketplace
  async create(vendorId: string, createMarketplaceDto: CreateMarketplaceDto) {
    // Generate slug from name
    const slug = createMarketplaceDto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug already exists
    const existingMarketplace = await this.marketplaceModel.findOne({ slug });
    if (existingMarketplace) {
      throw new BadRequestException('A marketplace with this name already exists');
    }

    const marketplace = new this.marketplaceModel({
      ...createMarketplaceDto,
      slug,
      vendorId: new Types.ObjectId(vendorId),
    });

    return marketplace.save();
  }

  // Update marketplace
  async update(id: string, vendorId: string, updateMarketplaceDto: UpdateMarketplaceDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid marketplace ID');
    }

    const marketplace = await this.marketplaceModel.findById(id);
    if (!marketplace) {
      throw new NotFoundException('Marketplace not found');
    }

    // Check ownership
    if (marketplace.vendorId.toString() !== vendorId) {
      throw new ForbiddenException('You do not have permission to update this marketplace');
    }

    // If name is being updated, regenerate slug
    if (updateMarketplaceDto.name && updateMarketplaceDto.name !== marketplace.name) {
      const slug = updateMarketplaceDto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Check if new slug already exists
      const existingMarketplace = await this.marketplaceModel.findOne({ 
        slug, 
        _id: { $ne: id } 
      });
      if (existingMarketplace) {
        throw new BadRequestException('A marketplace with this name already exists');
      }

      Object.assign(marketplace, updateMarketplaceDto, { slug });
    } else {
      Object.assign(marketplace, updateMarketplaceDto);
    }

    return marketplace.save();
  }

  // Delete marketplace
  async delete(id: string, vendorId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid marketplace ID');
    }

    const marketplace = await this.marketplaceModel.findById(id);
    if (!marketplace) {
      throw new NotFoundException('Marketplace not found');
    }

    // Check ownership
    if (marketplace.vendorId.toString() !== vendorId) {
      throw new ForbiddenException('You do not have permission to delete this marketplace');
    }

    // Check if marketplace has products
    const productsCount = await this.productModel.countDocuments({ marketplaceId: marketplace._id });
    if (productsCount > 0) {
      throw new BadRequestException(
        'Cannot delete marketplace with existing products. Please delete all products first.'
      );
    }

    await marketplace.deleteOne();
    return { message: 'Marketplace deleted successfully' };
  }
}
