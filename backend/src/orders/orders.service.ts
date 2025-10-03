import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';

interface CreateOrderItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface CreateOrderDto {
  items: CreateOrderItemDto[];
}

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>) {}

  async create(buyerId: string, dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }
    const items = dto.items.map((i) => ({
      productId: new Types.ObjectId(i.productId),
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    }));
    const totalAmount = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const created = await this.orderModel.create({
      buyerId: new Types.ObjectId(buyerId),
      items,
      totalAmount,
      status: 'pending',
    });
    return created;
  }

  async findAllByBuyer(buyerId: string) {
    return this.orderModel
      .find({ buyerId: new Types.ObjectId(buyerId) })
      .sort({ createdAt: -1 })
      .lean();
  }

  async updateStatus(orderId: string, status: string) {
    return this.orderModel.findByIdAndUpdate(
      new Types.ObjectId(orderId),
      { status },
      { new: true }
    );
  }

  async updateStatusBySessionId(sessionId: string, status: string) {
    return this.orderModel.findOneAndUpdate(
      { stripeSessionId: sessionId },
      { status },
      { new: true }
    );
  }

  async getAnalytics(buyerId: string) {
    const orders = await this.orderModel.find({ buyerId: new Types.ObjectId(buyerId) });
    
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'paid' || order.status === 'completed').length;
    
    return {
      totalSpent,
      totalOrders,
      pendingOrders,
      completedOrders,
      averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0
    };
  }
}

export type { CreateOrderDto, CreateOrderItemDto };

