import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Marketplace', required: true, index: true })
  marketplaceId: Types.ObjectId;

  @Prop({ default: 0 })
  inventory: number;

  @Prop({ default: 5 })
  lowStockThreshold: number;

  @Prop({ default: true })
  enableLowStockAlerts: boolean;

  @Prop()
  unit?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);


