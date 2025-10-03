import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  marketplaceId: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsNumber()
  @IsOptional()
  inventory?: number;

  @IsNumber()
  @IsOptional()
  lowStockThreshold?: number;

  @IsBoolean()
  @IsOptional()
  enableLowStockAlerts?: boolean;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
