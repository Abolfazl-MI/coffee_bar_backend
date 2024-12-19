import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mode } from 'fs';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { ShopDto, UpdateShopDto } from 'src/dto/shop/shop.dto';
import { ShopAddress } from 'src/schemas/adderess.schema';
import { CoffeeShop } from 'src/schemas/coffeShop.schema';
import { generatePaginationInfo } from 'src/utils/functions';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(CoffeeShop.name) private coffeeShopModel: Model<CoffeeShop>,
    @InjectModel(ShopAddress.name) private shopAddressModel: Model<ShopAddress>,
  ) {}
  // create coffee shop
  async createCoffeeShop(shopData: ShopDto,logo?:string): Promise<boolean> {
    const shopAddress = await this.shopAddressModel.create({
      street: shopData.address.street,
      city: shopData.address.city,
      state: shopData.address.state,
      postalCode: shopData.address.postalCode,
      geoLocation: shopData.address.geoLocation,
    });
    const shop = await this.coffeeShopModel.create({
      name: shopData.name,
      address: shopAddress,
      bio: shopData.bio,
      is_active: shopData.is_active,
      owner: shopData.owner,
      tables: shopData.tables,
      logo:logo
    });
    return true;
  }
  async updateShopInfo(userId:string,role:string,id:string,shopData:UpdateShopDto){
    const shop=await this.coffeeShopModel.findById(id)
    const shopOwnerId=shop.owner.toString()
    if(!shop){
      throw new NotFoundError('shop not found')
    }
    if(role==='shop_owner'&&shopOwnerId!==userId.toString()){
      throw new ForbiddenException('you are not allowed to update this shop')
    }
    await shop.updateOne(shopData)
    return true
  }
  async getAllShops(limit?:number,offset?:number){
    const shopCounts=await this.coffeeShopModel.countDocuments()
    const shops=await this.coffeeShopModel.find().limit(limit).skip(offset)
    const metadata=generatePaginationInfo(shopCounts,limit,offset)
    return {
      data:{
        shops
      },
      metadata
    }
  }
}
