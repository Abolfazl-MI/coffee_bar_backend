import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ProductCategory, ProductCategorySchema } from "./product.category.schema";
import {Document, Types} from 'mongoose'
@Schema({timestamps:true})
export class Product extends Document{
    @Prop({required:true})
    name:string
    @Prop({required:true})
    price:number
    @Prop({default:0})
    quantity:number
    @Prop({required:true})
    available:boolean
    @Prop()
    image:string
    @Prop()
    description:string
    @Prop({type:Types.ObjectId,ref:ProductCategory.name,required:true})
    category:Types.ObjectId
}

export const ProductSchema=SchemaFactory.createForClass(Product)