import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  RestrictedField,
  RestrictedFieldsKey,
} from 'src/types/restricted_fields';
import { Request } from 'express';
import { Role, User } from 'src/schemas/user.schema';
@Injectable()
export class RestrictedFieldGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    // user already present in req.user we check for role if admin would pass
    const request: Request = context.switchToHttp().getRequest();
    const user:User=request['user']
    if(user&& user.role===Role.admin){
        return true
    }
    const restricted_fields: RestrictedField[] =
      this.reflector.getAllAndOverride<RestrictedField[]>(RestrictedFieldsKey, [
        context.getHandler(),
        context.getClass(),
      ]);
    if(user&&user.role===Role.shop_owner){
        // we would take look at the request body if contains restricted fields to stop user
        const bodyKeys=Object.keys(request.body)
        return bodyKeys.every((key)=>!restricted_fields.includes(key.toString() as RestrictedField));
    }else{
        return false;
    }
  }
}
