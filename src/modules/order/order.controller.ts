import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/types/role.decorator';
import { Role } from 'src/schemas/user.schema';
import { OrderDto, UpdateOrderDto } from 'src/dto/orders/order.dto';
import { RestrictedField, RestrictedFields } from 'src/types/restricted_fields';
import { RestrictedFieldGuard } from 'src/guards/fied.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  //create order /api/v1/order
  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.shop_owner)
  async createOrder(@Body() body: OrderDto, @Request() req) {
    const ownerId = req.user._id.toString();
    const order = await this.orderService.createOrder(ownerId, body);
    return {
      message: 'order created',
      data: {
        order,
      },
    };
  }
  //get all orders /api/v1/order
  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.shop_owner)
  async getShopOrders(
    @Request() req,
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    const ownerId = req.user._id.toString();
    const sanitizedLimit = limit ? Number(limit) : 10;
    const sanitizedOffset = offset ? Number(offset) : 0;
    return await this.orderService.getAllShopOrders(
      ownerId,
      sanitizedLimit,
      sanitizedOffset,
    );
  }
  // get single order /api/v1/order/:id
  @Get(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.shop_owner)
  async getSingleOrder(@Param('id') id: string, @Request() req) {
    const ownerId = req.user._id.toString();
    return await this.orderService.getSingleShopOrder(ownerId, id);
  }
  //put update order /api/v1/order/:id
  @Put(':id')
  @UseGuards(AuthGuard, RoleGuard, RestrictedFieldGuard)
  @Roles(Role.shop_owner)
  @RestrictedFields(RestrictedField.is_active, RestrictedField.shopId)
  async updateOrder(
    @Param('id') id: string,
    @Body() body: UpdateOrderDto,
    @Request() request,
  ) {
    const ownerId = request.user._id.toString();
    return await this.orderService.updateOrder(id, ownerId, body);
  }
}
