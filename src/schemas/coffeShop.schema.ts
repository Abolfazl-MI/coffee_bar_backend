import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ShopAddress, ShopAddressSchema } from "./adderess.schema";
import { User } from "./user.schema";
import { ShopTable, ShopTableSchema } from "./shopTable.schema";

@Schema({timestamps:true})
export class CoffeeShop{
    @Prop({required:true})
    name:string
    @Prop()
    bio:string
    @Prop({type:ShopAddressSchema,required:true})
    address:ShopAddress
    @Prop({default:true})
    is_active:boolean
    @Prop({type:User,required:true})
    owner:User
    @Prop({type:[ShopTableSchema],default:[]})
    tables:ShopTable[]
    
}

export const CoffeeShopSchema=SchemaFactory.createForClass(CoffeeShop)