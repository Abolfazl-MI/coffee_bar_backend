import { SetMetadata } from "@nestjs/common/decorators"


export enum RestrictedField{
    is_active = 'is_active',
    role = 'role',
    owner='owner',
    shopId='shopId'
}



export const RestrictedFieldsKey='restricted_fields'
export const RestrictedFields=(...fields:RestrictedField[])=>SetMetadata(RestrictedFieldsKey,fields)