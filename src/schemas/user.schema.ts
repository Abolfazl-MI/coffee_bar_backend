import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from "mongoose"
export enum Role {
  'user',
  'shop_owner',
  'admin',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  first_name: string;
  @Prop()
  last_name: string;
  @Prop()
  avatar: string;
  @Prop({ type: String, enum: Role, default: Role.user })
  role: Role;
  @Prop({ type: Boolean, default: true })
  is_active: boolean;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
