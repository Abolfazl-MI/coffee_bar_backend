import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';
@Schema({ timestamps: true })
export class ProductCategory extends Document{
    @Prop({ required: true })
    name: string;
    @Prop({default:true})
    is_active:boolean
}
export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
