import {
  Body,
  Controller,
  FileTypeValidator,
  Request,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/types/role.decorator';
import { Role } from 'src/schemas/user.schema';
import { RestrictedField, RestrictedFields } from 'src/types/restricted_fields';
import { RestrictedFieldGuard } from 'src/guards/fied.guard';
import { ShopDto, UpdateShopDto } from 'src/dto/shop/shop.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  NoFilesInterceptor,
} from '@nestjs/platform-express';
import { appStorage, fileSizeLimitation } from 'src/utils/multer.config';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}
  /**@CREATE-SHOP*/
  /**@ADMIN**/
  @Post()
  @UseInterceptors(FileInterceptor('logo', { storage: appStorage }))
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.admin)
  async createShop(
    @Body() body: ShopDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: fileSizeLimitation }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    {
      let result = await this.shopService.createCoffeeShop(body);
      if (result) {
        return {
          message: 'shop created',
        };
      }
    }
  }
  // admin only
  // get all shops
  @Get('all')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.admin)
  async getAllShops(
    @Query('limit')
    limit: string,
    @Query('offset')
    offset: string,
  ) {
    const sanitizedLimit = limit ? Number(limit) : 10; // Default value: 10
    const sanitizedOffset = offset ? Number(offset) : 0; // Default value: 0
    return await this.shopService.getAllShops(sanitizedLimit, sanitizedOffset);
  }

  @Put()
  @UseInterceptors(FileInterceptor('logo', { storage: appStorage }))
  @UseGuards(AuthGuard, RoleGuard, RestrictedFieldGuard)
  @Roles(Role.shop_owner)
  @RestrictedFields(
    RestrictedField.is_active,
    RestrictedField.owner,
    RestrictedField.owner,
  )
  async updateShop(
    @Body() body: UpdateShopDto,
    @Request() request,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: fileSizeLimitation }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    logo: Express.Multer.File,
  ) {
    return await this.shopService.updateShopInfo(
      request.user._id,
      body,
      logo ? logo.path : null,
    );
  }
  // get shop tables
  @Get('/tables')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.shop_owner)
  async getShopTables(
    @Request() request,
    @Query('limit')
    limit: string,
    @Query('offset')
    offset: string,
  ) {
    const userId=request.user._id.toString()
    const sanitizedLimit = limit ? Number(limit) : 10; // Default value: 10
    const sanitizedOffset = offset ? Number(offset) : 0; // Default value: 0
    return await this.shopService.getShopTables(userId,sanitizedLimit,sanitizedOffset)
  }

    // get shop info
    @Get()
    @UseGuards(AuthGuard,RoleGuard)
    @Roles(Role.shop_owner)
    async getShopInfo( @Request() request){
    const userId=request.user._id.toString()
      return await this.shopService.getShopInfo(userId)
    }
}
