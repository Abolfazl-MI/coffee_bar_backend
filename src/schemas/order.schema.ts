import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, ref: 'CoffeeShop' })
  shopId: Types.ObjectId;
  @Prop({ type: [Types.ObjectId], required: true, ref: 'Product' })
  productIds: Types.ObjectId[];
}
export const OrderSchema = SchemaFactory.createForClass(Order);