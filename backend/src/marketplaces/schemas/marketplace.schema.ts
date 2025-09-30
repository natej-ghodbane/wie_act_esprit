import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MarketplaceDocument = HydratedDocument<Marketplace>;

@Schema({ timestamps: true })
export class Marketplace {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop({ type: Object })
  location?: {
    country?: string;
    city?: string;
    address?: string;
    coords?: { lat: number; lng: number };
  };

  @Prop()
  bannerImage?: string;

  @Prop()
  logoImage?: string;

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const MarketplaceSchema = SchemaFactory.createForClass(Marketplace);


