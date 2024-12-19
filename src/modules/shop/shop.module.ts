import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { CoffeeShop, CoffeeShopSchema } from 'src/schemas/coffeShop.schema';
import { ShopAddress, ShopAddressSchema } from 'src/schemas/adderess.schema';
import { ShopTable, ShopTableSchema } from 'src/schemas/shopTable.schema';
import { UserSchema,User } from 'src/schemas/user.schema';

@Module({
  imports: [
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
      }
    ]),
  ],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
