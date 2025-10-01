import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Get all products with optional filters (public)
  @Get()
  async getProducts(@Query() query: any) {
    console.log('GET /products - Query params:', query);
    const filters: Record<string, unknown> = {};
    if (query.category) {
      filters.category = query.category;
    }
    if (query.vendorId) {
      console.log('VendorId filter requested:', query.vendorId);
      filters.vendorId = query.vendorId;
    }
    if (query.marketplaceId) {
      filters.marketplaceId = query.marketplaceId;
    }
    console.log('Filters being passed to service:', filters);
    const result = await this.productsService.findAll(filters);
    console.log('Returning products count:', result.length);
    return result;
  }

  // Get single product by ID (public)
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  // Create product (protected - farmers only)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(@Request() req, @Body() createProductDto: CreateProductDto) {
    console.log('Creating product for user:', req.user._id);
    return this.productsService.create(String(req.user._id), createProductDto);
  }

  // Update product (protected - owner only)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Request() req,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, String(req.user._id), updateProductDto);
  }

  // Delete product (protected - owner only)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteProduct(@Param('id') id: string, @Request() req) {
    return this.productsService.delete(id, String(req.user._id));
  }
}

