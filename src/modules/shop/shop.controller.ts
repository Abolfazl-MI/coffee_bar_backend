import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ShopService } from './shop.service';
import { AuthGuard } from "src/guards/auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { Roles } from "src/types/role.decorator";
import { Role } from "src/schemas/user.schema";
import { RestrictedField, RestrictedFields } from "src/types/restricted_fields";
import { RestrictedFieldGuard } from "src/guards/fied.guard";

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}
  /**@CREATE-SHOP*/
  /**@ADMIN**/
  @Post()
  @UseGuards(AuthGuard,RoleGuard)
  @Roles(Role.admin)
  async createShop() {}
  /**@Get all shops*/
  /**@ADMIN*/
  @Get()
  @UseGuards(AuthGuard,RoleGuard)
  @Roles(Role.admin)
  async getAllShops(){}
  /**@Get single shop*/
  /**@ADMIN,@Owner*/
  @Get(':id')
  async getShop(@Param('id') id: string) {}
  //@put request , admin and owner only ,
  /**@Update shop*/
  /**@ADMIN,@Owner*/
  @Get(':id')
  @UseGuards(AuthGuard,RoleGuard,RestrictedFieldGuard)
  @Roles(Role.admin,Role.shop_owner)
  @RestrictedFields(RestrictedField.is_active,RestrictedField.owner,RestrictedField.owner)
  async updateShop(@Param('id') id: string) {}
  
}

