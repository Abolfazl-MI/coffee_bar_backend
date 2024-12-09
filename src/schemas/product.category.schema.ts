import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class ProductCategory {
    @Prop({ required: true })
    name: string;
    @Prop({default:true})
    is_active:boolean
}
export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
