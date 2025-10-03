import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ 
    type: String, 
    enum: ['low_stock', 'out_of_stock', 'restock', 'general'], 
    default: 'general' 
  })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'Product', index: true })
  productId?: Types.ObjectId;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: 'info', enum: ['info', 'warning', 'error', 'success'] })
  priority: string;

  @Prop()
  actionUrl?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);