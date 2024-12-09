import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum TableStatus {
  'available',
  'occupied',
  'reserved',
}

@Schema({ timestamps: true })
export class ShopTable {
  @Prop({ required: true, unique: true })
  tableNumber: number;
  @Prop({ required: true })
  capacity: number;
  @Prop({ type: TableStatus, default: TableStatus.available })
  status: TableStatus;
  @Prop({default:true})
  is_active:boolean
}
export const ShopTableSchema = SchemaFactory.createForClass(ShopTable);
