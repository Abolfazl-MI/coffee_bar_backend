import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderStatus{
  pending='pending',
  preparing ='preparing',
  ready='ready',
  completed='completed',
  canceled='canceled '
}
@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, ref: 'CoffeeShop' })
  shopId: Types.ObjectId;
  @Prop({ type: [Types.ObjectId], required: true, ref: 'Product' })
  productIds: Types.ObjectId[];
  @Prop({required:true})
  totalAmount:number
  @Prop({type:String,enum:OrderStatus,default:OrderStatus.pending})
  status:OrderStatus
}
export const OrderSchema = SchemaFactory.createForClass(Order);
