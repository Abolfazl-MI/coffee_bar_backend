import { ForbiddenException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mode } from 'fs';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { ShopDto, UpdateShopDto } from 'src/dto/shop/shop.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ShopAddress } from 'src/schemas/adderess.schema';
import { CoffeeShop } from 'src/schemas/coffeShop.schema';
import { ShopTable } from 'src/schemas/shopTable.schema';
import { generatePaginationInfo } from 'src/utils/functions';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(CoffeeShop.name) private coffeeShopModel: Model<CoffeeShop>,
    @InjectModel(ShopAddress.name) private shopAddressModel: Model<ShopAddress>,
    @InjectModel(ShopTable.name) private shopTable: Model<ShopTable>,
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
      logo:logo
    });
    let tableData=shopData.tables.map((table)=>({
      shopId:shop._id.toString(),
      ...table
    }))
    let tableInsert=await this.shopTable.insertMany(tableData)
    const tableIds = tableInsert.map(table => table._id);
    await this.coffeeShopModel.findOneAndUpdate(
      shop._id,
      {$set:{tables:tableIds}},
      {new:true}
    )
    return true;
  }
  async updateShopInfo(userId:string,shopData:UpdateShopDto,logo?:string){
    const shop=await this.coffeeShopModel.findOne({owner:userId.toString()})
    if(!shop){
      throw new NotFoundException('You have no shop associated')
    }
    const data={
      ...shopData
    }
    if(logo){
      data['logo']=logo
    }
    let result=await shop.updateOne(data)
    return result
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
  async getShopTables(userId:string,limit?:number,offset?:number){
    const shop=await this.coffeeShopModel.findOne({owner:userId.toString()})
    if(!shop){
      throw new NotFoundException('You have no shop associated')
    }
    const tablesCount=await this.shopTable.countDocuments({shopId:shop._id.toString()})
    const tables=await this.shopTable.find({shopId:shop._id.toString()}).limit(limit).skip(offset)
    const metadata=generatePaginationInfo(tablesCount,limit,offset)
    return {
      data:{
        tables
      },
      metadata
    }
  }
  async getShopInfo(userId:string){
      const shop=await this.coffeeShopModel.findOne({
        owner:userId.toString()
      })
      if(!shop) throw new NotFoundException('shop not found')
      return shop
  }
}
