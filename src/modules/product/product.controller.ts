import { ProductService } from './product.service';
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
  ParseFloatPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { RestrictedField, RestrictedFields } from 'src/types/restricted_fields';
import { RestrictedFieldGuard } from 'src/guards/fied.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/types/role.decorator';
import { Role } from 'src/schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { appStorage, fileSizeLimitation } from 'src/utils/multer.config';
import { ProductCategoryDto } from 'src/dto/product/productcategory.dto';
@Controller('shop/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //create product category // owner only
  @Post('category')
  @UseInterceptors(FileInterceptor('image', { storage: appStorage }))
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.shop_owner)
  async createCategory(
    @Body() body: ProductCategoryDto,
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
    return await this.productService.createCategory(
      body,
      file ? file.path : null,
    );
  }
  // get all product category owner only
  @Get('categories')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.shop_owner)
  async getAllCategories(
    @Query('limit')
    limit: string,
    @Query('offset')
    offset: string,
  ) {
    const sanitizedLimit = limit ? Number(limit) : 10; // Default value: 10
    const sanitizedOffset = offset ? Number(offset) : 0; // Default value: 0
    return await this.productService.getALlCategories(sanitizedLimit, sanitizedOffset);
  }

  // update product
  // delete product
  // get all product
  // get single product

  //create product category
  // update product category
  // delete product category

  // get single product category
}
