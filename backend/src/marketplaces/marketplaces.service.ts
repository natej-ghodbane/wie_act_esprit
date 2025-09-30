import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Marketplace, MarketplaceDocument } from './schemas/marketplace.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class MarketplacesService {
  constructor(
    @InjectModel(Marketplace.name) private readonly marketplaceModel: Model<MarketplaceDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  async findAll() {
    const marketplaces = await this.marketplaceModel.find({ isActive: true }).lean();
    
    // Get product counts for each marketplace
    const marketplacesWithCounts = await Promise.all(
      marketplaces.map(async (marketplace) => {
        const productsCount = await this.productModel.countDocuments({ 
          marketplaceId: String(marketplace._id) 
        });
        return { ...marketplace, productsCount };
      })
    );
    
    return marketplacesWithCounts;
  }

  async findById(id: string) {
    return this.marketplaceModel.findById(id).lean();
  }

  async findBySlug(slug: string) {
    return this.marketplaceModel.findOne({ slug }).lean();
  }
}


