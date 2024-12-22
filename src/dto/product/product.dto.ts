import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";


export class ProductDto{
    @IsNotEmpty()
    name:string
    @IsNotEmpty()
    price:number
    @IsOptional()
    @IsNotEmpty()
    quantity:number
    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    available:boolean
    @IsOptional()
    description:string
    @IsNotEmpty()
    @IsMongoId()
    category:string
   
    
}
export class UpdateProductDto extends PartialType(ProductDto){
    
}