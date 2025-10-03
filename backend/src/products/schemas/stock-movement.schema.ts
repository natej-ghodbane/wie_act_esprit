import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StockMovementDocument = HydratedDocument<StockMovement>;

@Schema({ timestamps: true })
export class StockMovement {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true, index: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  previousQuantity: number;

  @Prop({ required: true })
  newQuantity: number;

  @Prop({ required: true })
  change: number; // positive for increases, negative for decreases

  @Prop({ 
    type: String, 
    enum: ['manual_adjustment', 'sale', 'restock', 'damage', 'theft', 'correction'], 
    required: true 
  })
  reason: string;

  @Prop()
  notes?: string;

  @Prop({ type: Types.ObjectId, ref: 'Order' })
  orderId?: Types.ObjectId;
}

export const StockMovementSchema = SchemaFactory.createForClass(StockMovement);