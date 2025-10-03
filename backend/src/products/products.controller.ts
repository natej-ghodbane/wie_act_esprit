import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StockAdjustmentDto, BulkStockUpdateDto, StockMovementQueryDto, LowStockThresholdDto } from './dto/stock-management.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Get all products with optional filters (public)
  @Get()
  async getProducts(@Query() query: any) {
    try {
      console.log('Getting products with query:', query);
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
      const products = await this.productsService.findAll(filters);
      console.log('Found products:', products.length);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
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

  // Stock Management Endpoints
  
  // Adjust stock for a specific product
  @UseGuards(JwtAuthGuard)
  @Put(':id/stock')
  async adjustStock(
    @Param('id') id: string,
    @Request() req,
    @Body() stockAdjustmentDto: StockAdjustmentDto
  ) {
    return this.productsService.adjustStock(id, String(req.user._id), stockAdjustmentDto);
  }

  // Bulk update stock for multiple products
  @UseGuards(JwtAuthGuard)
  @Post('stock/bulk-update')
  async bulkUpdateStock(@Request() req, @Body() bulkStockUpdateDto: BulkStockUpdateDto) {
    return this.productsService.bulkUpdateStock(String(req.user._id), bulkStockUpdateDto);
  }

  // Get stock movements history
  @UseGuards(JwtAuthGuard)
  @Get('stock/movements')
  async getStockMovements(@Request() req, @Query() query: StockMovementQueryDto) {
    return this.productsService.getStockMovements(String(req.user._id), query);
  }

  // Update low stock threshold for a product
  @UseGuards(JwtAuthGuard)
  @Put(':id/threshold')
  async updateLowStockThreshold(
    @Param('id') id: string,
    @Request() req,
    @Body() thresholdDto: LowStockThresholdDto
  ) {
    return this.productsService.updateLowStockThreshold(id, String(req.user._id), thresholdDto);
  }

  // Get low stock products
  @UseGuards(JwtAuthGuard)
  @Get('stock/low')
  async getLowStockProducts(@Request() req) {
    return this.productsService.getLowStockProducts(String(req.user._id));
  }

  // Get stock analytics
  @UseGuards(JwtAuthGuard)
  @Get('stock/analytics')
  async getStockAnalytics(@Request() req) {
    return this.productsService.getStockAnalytics(String(req.user._id));
  }
}

