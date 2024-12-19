import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsPostalCode, IsString, ValidateNested } from "class-validator";
export class GeoLocationDTO {
    @IsString()
    type: string;
  
    @IsArray()
    @IsNumber({}, { each: true })
    coordinates: [number, number];
  }

export class ShopAddressDTO {
    @IsNotEmpty()
    @IsString()
    street: string;
  
    @IsNotEmpty()
    @IsString()
    city: string;
  
    @IsNotEmpty()
    @IsString()
    state: string;
  
    @IsNotEmpty()
    @IsPostalCode('any') // Adjust for a specific locale if needed
    postalCode: string;
  
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => GeoLocationDTO)
    geoLocation: GeoLocationDTO;
  }

  export class UpdateShopAddressDto extends PartialType(ShopAddressDTO){
    @ValidateNested()
    @Type(() => PartialType(GeoLocationDTO))
    geoLocation?: GeoLocationDTO

  }