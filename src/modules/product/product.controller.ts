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
import {
  ProductCategoryDto,
  UpdateProductCategoryDto,
} from 'src/dto/product/productcategory.dto';
import { ProductDto, UpdateProductDto } from 'src/dto/product/product.dto';
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
    return await this.productService.getALlCategories(
      sanitizedLimit,
      sanitizedOffset,
    );
  }

  // crud of products
  //create
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: appStorage }))
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.shop_owner)
  async createProduct(
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
    file: Express.Multer.File,
    @Body() body: ProductDto,
  ) {
    const userId = request.user._id.toString();
    return await this.productService.createProduct(
      userId,
      body,
      file ? file.path : null,
    );
  }
  //get products
  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.shop_owner)
  async getAllProducts(
    @Request() request,
    @Query('limit')
    limit: string,
    @Query('offset')
    offset: string,
  ) {
    const sanitizedLimit = limit ? Number(limit) : 10; // Default value: 10
    const sanitizedOffset = offset ? Number(offset) : 0; // Default value: 0
    const userId = request.user._id.toString();
    return await this.productService.getShopProducts(userId,sanitizedLimit,sanitizedOffset);
  }
  // update category
  // get single product
  @Get(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.shop_owner)
  async getProduct(@Param('id') id: string,@Request() request) {
    const userId=request.user._id.toString()
    return await this.productService.getSingleProduct(userId,id);
  }
  // update product
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', { storage: appStorage }))
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.shop_owner)
  async updateProduct(
    @Param('id') id: string,
    @Request() request,
    @Body() body: UpdateProductDto,
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
    const userId = request.user._id.toString();
    return await this.productService.updateProduct(
      userId,
      id,
      body,
      file ? file.path : null,
    );
  }

  @Put('category/:id')
  @UseInterceptors(FileInterceptor('image', { storage: appStorage }))
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.shop_owner)
  async updateCategory(
    @Param('id') id: string,
    @Body() body: UpdateProductCategoryDto,
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
    return await this.productService.updateCategory(
      id,
      body,
      file ? file.path : null,
    );
  }
}
