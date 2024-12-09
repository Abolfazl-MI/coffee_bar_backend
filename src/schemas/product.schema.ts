import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ProductCategory, ProductCategorySchema } from "./product.category.schema";

@Schema({timestamps:true})
export class Product{
    @Prop({required:true})
    name:string
    @Prop({required:true})
    price:number
    @Prop({required:true})
    quantity:number
    @Prop({required:true})
    available:boolean
    @Prop()
    image:string
    @Prop()
    description:string
    @Prop({type:ProductCategorySchema,required:true})
    category:ProductCategory
}

export const ProductSchema=SchemaFactory.createForClass(Product)