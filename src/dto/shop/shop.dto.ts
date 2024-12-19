import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ShopAddress } from 'src/schemas/adderess.schema';
import { ShopTable } from 'src/schemas/shopTable.schema';
import { ShopTableDto, UpdateShopTableDto } from './shopTable.dto';
import { Type } from 'class-transformer';
import { ShopAddressDTO, UpdateShopAddressDto } from './shopAddress.dto';
import { PartialType } from '@nestjs/mapped-types';

export class ShopDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  bio: string;
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ShopAddressDTO)
  address: ShopAddressDTO;
  @IsOptional()
  @IsNotEmpty()
  is_active: boolean;
  @IsNotEmpty()
  @IsMongoId()
  owner: string;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShopTableDto)
  tables: ShopTableDto[];
}

export class UpdateShopDto extends PartialType(ShopDto) {
  @ValidateNested()
  @Type(() => UpdateShopAddressDto)
  address?: ShopAddressDTO;
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => UpdateShopTableDto)
  tables?: ShopTableDto[];
}
