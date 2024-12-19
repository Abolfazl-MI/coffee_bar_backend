import { Body, Controller, FileTypeValidator,Request, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ShopService } from './shop.service';
import { AuthGuard } from "src/guards/auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { Roles } from "src/types/role.decorator";
import { Role } from "src/schemas/user.schema";
import { RestrictedField, RestrictedFields } from "src/types/restricted_fields";
import { RestrictedFieldGuard } from "src/guards/fied.guard";
import { ShopDto, UpdateShopDto } from "src/dto/shop/shop.dto";
import { FileInterceptor, NoFilesInterceptor } from "@nestjs/platform-express";
import { appStorage, fileSizeLimitation } from "src/utils/multer.config";

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}
  /**@CREATE-SHOP*/
  /**@ADMIN**/
  @Post()
  @UseInterceptors(FileInterceptor('logo',{storage:appStorage}))
  @UseGuards(AuthGuard,RoleGuard)
  @Roles(Role.admin)
  async createShop(@Body() body: ShopDto,@UploadedFile(new ParseFilePipe(
    {
      fileIsRequired: false,
      validators: [
        new MaxFileSizeValidator({ maxSize: fileSizeLimitation }),
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
      ],
    }
  ))file:Express.Multer.File){ {
    let result=await this.shopService.createCoffeeShop(body)
    if(result){
      return {
        message:'shop created'
      }
    }
  }
}

  @Put(':id')
  @UseGuards(AuthGuard,RoleGuard,RestrictedFieldGuard)
  @Roles(Role.admin,Role.shop_owner)
  @RestrictedFields(RestrictedField.is_active,RestrictedField.owner,RestrictedField.owner)
  async updateShop(@Param('id') id: string,@Body()body:UpdateShopDto,@Request()request) {
    let shop=await this.shopService.updateShopInfo(request.user._id,request.user.role,id,body);
    if(shop){
      return {
        message:"shop updated"
      }
    }
    // return request.user
  }
  
}

