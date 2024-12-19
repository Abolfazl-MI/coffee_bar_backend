import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { TableStatus } from "src/schemas/shopTable.schema";


export class ShopTableDto 
{
    @IsNotEmpty()
    @IsNumber({})
    tableNumber: number;
    @IsNotEmpty()
    @IsNumber({})
    capacity:number
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(TableStatus)
    status:TableStatus
    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    is_active:boolean

}

export class UpdateShopTableDto extends PartialType(ShopTableDto){
    
} 