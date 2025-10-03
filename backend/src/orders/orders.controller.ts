import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getMyOrders(@Req() req: any) {
    console.log('Getting orders for user:', req.user._id || req.user.id);
    const orders = await this.ordersService.findAllByBuyer(req.user._id || req.user.id);
    console.log('Found orders:', orders.length);
    return orders;
  }

  @Post()
  async createOrder(@Req() req: any, @Body() body: { items: { productId: string; quantity: number; unitPrice: number }[] }) {
    console.log('Creating order for user:', req.user._id || req.user.id);
    console.log('Order items:', body.items);
    const order = await this.ordersService.create(req.user._id || req.user.id, body);
    console.log('Order created:', order._id);
    return order;
  }

  @Post(':id/status')
  async updateOrderStatus(@Req() req: any, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(req.params.id, body.status);
  }

  @Get('analytics')
  async getAnalytics(@Req() req: any) {
    return this.ordersService.getAnalytics(req.user._id || req.user.id);
  }
}


