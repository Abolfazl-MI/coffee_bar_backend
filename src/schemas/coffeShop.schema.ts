import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ShopAddress, ShopAddressSchema } from './adderess.schema';
import { User } from './user.schema';
import { ShopTable, ShopTableSchema } from './shopTable.schema';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CoffeeShop extends Document {
  @Prop({ required: true })
  name: string;
  @Prop()
  bio: string;
  @Prop({ type: ShopAddressSchema, required: true })
  address: ShopAddress;
  @Prop({ default: true })
  is_active: boolean;
  @Prop()
  logo: string;
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  owner: Types.ObjectId;
  @Prop({
    type: [Types.ObjectId],
    ref: ShopTable.name,
    default: [],
  })
  tables: Types.ObjectId[];
}

export const CoffeeShopSchema = SchemaFactory.createForClass(CoffeeShop);
