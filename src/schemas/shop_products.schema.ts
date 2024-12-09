import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
@Schema({ timestamps: true })
export class Shop_Products {
    @Prop({type:Types.ObjectId,required:true,ref:'CoffeeShop'})
    shopId:Types.ObjectId
    @Prop({type:[Types.ObjectId],required:true,ref:'Product'})
    products:Types.ObjectId[]
}
export const Shop_ProductsSchema = SchemaFactory.createForClass(Shop_Products);
