import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoffeeShop, CoffeeShopSchema } from 'src/schemas/coffeShop.schema';
import {  ProductCategory,ProductCategorySchema} from 'src/schemas/product.category.schema';
import { ShopAddress, ShopAddressSchema } from 'src/schemas/adderess.schema';
import {Product,ProductSchema  } from 'src/schemas/product.schema';
import { ShopTable, ShopTableSchema } from 'src/schemas/shopTable.schema';
import { UserSchema,User } from 'src/schemas/user.schema';


@Module({
  imports:[
    MongooseModule.forFeature([
          {
            name: CoffeeShop.name,
            schema: CoffeeShopSchema,
          },
          {
            name:ShopAddress.name,
            schema:ShopAddressSchema
          },
          {
            name:ShopTable.name,
            schema:ShopTableSchema
          },
          {
            name:User.name,
            schema:UserSchema
          },
          {
            name:ProductCategory.name,
            schema:ProductCategorySchema
          },
          {
            name:Product.name,
            schema:ProductSchema
          },
        ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
