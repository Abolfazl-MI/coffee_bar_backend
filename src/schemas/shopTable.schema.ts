import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from "mongoose"

export enum TableStatus {
  'available',
  'occupied',
  'reserved',
}
@Schema({ timestamps: true })
export class ShopTable extends Document{
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
