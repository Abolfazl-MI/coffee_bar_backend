import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { OrderStatus } from 'src/schemas/order.schema';

export class OrderDto {
  @IsNotEmpty()
  @IsMongoId()
  // customer user id
  userId: string;
  @IsNotEmpty()
  @IsMongoId()
  shopId: string;
  @IsNotEmpty()
  @IsArray()
  @IsMongoId()
  productIds: string[];

}

export class UpdateOrderDto extends PartialType(OrderDto) {
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status:OrderStatus
}
