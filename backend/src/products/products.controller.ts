import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() query: any) {
    const filters: Record<string, unknown> = {};
    if (query.category) {
      filters.category = query.category;
    }
    if (query.vendorId) {
      filters.vendorId = query.vendorId;
    }
    if (query.marketplaceId) {
      filters.marketplaceId = query.marketplaceId;
    }
    return this.productsService.findAll(filters);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Post()
  async createProduct(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }
}


