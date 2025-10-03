import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: true, timestamps: true })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1 })
  quantity: number;

  @Prop({ type: Number, required: true, min: 0 })
  unitPrice: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  buyerId: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];

  @Prop({ type: Number, required: true, min: 0 })
  totalAmount: number;

  @Prop({
    type: String,
    enum: ['pending', 'paid', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Prop()
  stripeSessionId?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

