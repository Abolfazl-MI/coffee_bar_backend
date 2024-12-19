import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({timestamps:true})
export class ShopAddress extends Document {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  postalCode: string;
  @Prop({
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  })
  geoLocation: {
    type: string;
    coordinates: [number, number];
  };
}
export const ShopAddressSchema=SchemaFactory.createForClass(ShopAddress)