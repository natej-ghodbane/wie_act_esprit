import { Controller, Get, Param, Query } from '@nestjs/common';
import { MarketplacesService } from './marketplaces.service';
import { ProductsService } from '../products/products.service';

@Controller('marketplaces')
export class MarketplacesController {
  constructor(
    private readonly marketplacesService: MarketplacesService,
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  async getMarketplaces() {
    const marketplaces = await this.marketplacesService.findAll();
    console.log('Found marketplaces:', marketplaces.length);
    return marketplaces;
  }

  @Get(':slug')
  async getMarketplace(@Param('slug') slug: string, @Query('include') include?: string) {
    console.log('Getting marketplace by slug:', slug, 'include:', include);
    const marketplace = await this.marketplacesService.findBySlug(slug);
    console.log('Found marketplace:', marketplace);
    
    if (!marketplace) {
      return { marketplace: null, products: [] };
    }
    
    if (!include || include !== 'products' || !marketplace._id) {
      return { marketplace };
    }
    
    const products = await this.productsService.findAll({ marketplaceId: String(marketplace._id) });
    console.log('Found products for marketplace:', products.length);
    return { marketplace, products };
  }
}


