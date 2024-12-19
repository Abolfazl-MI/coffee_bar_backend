import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class ProductCategoryDto {
  @IsNotEmpty()
  name: string;
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}

export class UpdateProductCategoryDto extends PartialType(ProductCategoryDto) {}
