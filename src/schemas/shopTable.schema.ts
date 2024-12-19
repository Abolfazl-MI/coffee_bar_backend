import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types} from "mongoose"
import { CoffeeShop } from './coffeShop.schema';


export enum TableStatus {
  available= 'available',
  occupied='occupied',
  reserved= 'reserved',
}
@Schema()
export class ShopTable extends Document{
  @Prop({required:true,type:Types.ObjectId,ref:'coffeeshops'})
  shopId:string
  @Prop({ required: true, })
  tableNumber: number;
  @Prop({ required: true })
  capacity: number;
  @Prop({ type: String, enum:TableStatus,default: TableStatus.available })
  status: TableStatus;
  @Prop({default:true})
  is_active:boolean
}
export const ShopTableSchema = SchemaFactory.createForClass(ShopTable);
