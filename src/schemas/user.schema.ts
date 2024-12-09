import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
export type UserDocument =HydratedDocument<User>;
export enum Role{
    'user',
    'shop_owner',
    'admin'
}
@Schema({timestamps:true})
export class User{
    @Prop()
    first_name:string
    @Prop()
    last_name:string
    @Prop()
    avatar:string
    @Prop({type:String,enum:Role,default:Role.user})
    role:Role
    @Prop({type:Boolean,default:true})
    is_active:boolean
}

export const UserSchema=SchemaFactory.createForClass(User)