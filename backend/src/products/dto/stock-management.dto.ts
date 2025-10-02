import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class StockAdjustmentDto {
  @IsNumber()
  @Min(0)
  newQuantity: number;

  @IsEnum(['manual_adjustment', 'sale', 'restock', 'damage', 'theft', 'correction'])
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class BulkStockUpdateDto {
  @IsArray()
  updates: BulkStockItemDto[];
}

export class BulkStockItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(0)
  newQuantity: number;

  @IsEnum(['manual_adjustment', 'sale', 'restock', 'damage', 'theft', 'correction'])
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class LowStockThresholdDto {
  @IsNumber()
  @Min(0)
  threshold: number;
}

export class StockMovementQueryDto {
  @IsString()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;
}