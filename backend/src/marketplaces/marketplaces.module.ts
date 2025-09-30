import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketplacesService } from './marketplaces.service';
import { MarketplacesController } from './marketplaces.controller';
import { Marketplace, MarketplaceSchema } from './schemas/marketplace.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Marketplace.name, schema: MarketplaceSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    ProductsModule,
  ],
  controllers: [MarketplacesController],
  providers: [MarketplacesService],
  exports: [MarketplacesService],
})
export class MarketplacesModule {}


