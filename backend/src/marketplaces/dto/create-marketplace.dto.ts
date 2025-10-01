import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean, IsObject } from 'class-validator';

export class CreateMarketplaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  location?: {
    country?: string;
    city?: string;
    address?: string;
    coords?: { lat: number; lng: number };
  };

  @IsString()
  @IsOptional()
  bannerImage?: string;

  @IsString()
  @IsOptional()
  logoImage?: string;

  @IsArray()
  @IsOptional()
  categories?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
