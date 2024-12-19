import { IsArray, IsMongoId, IsNotEmpty } from "class-validator";


export class ShopProductDto{
    @IsNotEmpty()
    @IsMongoId()
    shopId:string
    @IsArray()
    @IsNotEmpty()
    @IsMongoId()
    products:string[]
}