import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { MarketplacesService } from './marketplaces.service';
import { ProductsService } from '../products/products.service';
import { CreateMarketplaceDto } from './dto/create-marketplace.dto';
import { UpdateMarketplaceDto } from './dto/update-marketplace.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('marketplaces')
export class MarketplacesController {
  constructor(
    private readonly marketplacesService: MarketplacesService,
    private readonly productsService: ProductsService,
  ) {}

  // Get all marketplaces (public)
  @Get()
  async getMarketplaces(@Query('vendorId') vendorId?: string) {
    if (vendorId) {
      return this.marketplacesService.findByVendor(vendorId);
    }
    const marketplaces = await this.marketplacesService.findAll();
    console.log('Found marketplaces:', marketplaces.length);
    return marketplaces;
  }

  // Get marketplace by slug (public)
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

  // Get marketplace by ID (public)
  @Get('id/:id')
  async getMarketplaceById(@Param('id') id: string, @Query('include') include?: string) {
    const marketplace = await this.marketplacesService.findOne(id);
    
    if (!marketplace) {
      return { marketplace: null, products: [] };
    }
    
    if (!include || include !== 'products' || !marketplace._id) {
      return { marketplace };
    }
    
    const products = await this.productsService.findAll({ marketplaceId: String(marketplace._id) });
    return { marketplace, products };
  }

  // Create marketplace (protected - farmers only)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createMarketplace(@Request() req, @Body() createMarketplaceDto: CreateMarketplaceDto) {
    console.log('Creating marketplace for user:', req.user._id);
    console.log('Marketplace data:', createMarketplaceDto);
    const result = await this.marketplacesService.create(String(req.user._id), createMarketplaceDto);
    console.log('Created marketplace:', result);
    return result;
  }

  // Update marketplace (protected - owner only)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateMarketplace(
    @Param('id') id: string,
    @Request() req,
    @Body() updateMarketplaceDto: UpdateMarketplaceDto
  ) {
    return this.marketplacesService.update(id, String(req.user._id), updateMarketplaceDto);
  }

  // Delete marketplace (protected - owner only)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteMarketplace(@Param('id') id: string, @Request() req) {
    return this.marketplacesService.delete(id, String(req.user._id));
  }
}

