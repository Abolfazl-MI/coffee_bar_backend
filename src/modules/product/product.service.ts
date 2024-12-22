import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { timeStamp } from 'console';
import { Model } from 'mongoose';
import { ProductDto, UpdateProductDto } from 'src/dto/product/product.dto';
import {
  ProductCategoryDto,
  UpdateProductCategoryDto,
} from 'src/dto/product/productcategory.dto';
import { CoffeeShop } from 'src/schemas/coffeShop.schema';
import { ProductCategory } from 'src/schemas/product.category.schema';
import { Product } from 'src/schemas/product.schema';
import { generatePaginationInfo } from 'src/utils/functions';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(ProductCategory.name)
    private readonly categoryModel: Model<ProductCategory>,
    @InjectModel(CoffeeShop.name)
    private readonly coffeeShopModel: Model<CoffeeShop>,
  ) {}

  async createCategory(body: ProductCategoryDto, image?: string) {
    let data = {
      ...body,
    };
    if (image) {
      data['image'] = image;
    }
    const category = await this.categoryModel.create(data);
    return category;
  }

  async getALlCategories(limit?: number, offset?: number) {
    return await this.categoryModel.find().limit(limit).skip(offset);
  }

  async updateCategory(
    id: string,
    data: UpdateProductCategoryDto,
    image?: string,
  ) {
    let category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException();
    }
    let categoryData = {
      ...data,
    };
    if (image) {
      categoryData['image'] = image;
    }
    let result = await category.updateOne(categoryData);
    return result;
  }

  async createProduct(id: string, data: ProductDto, image?: string) {
    let shop = await this.coffeeShopModel.findOne({
      owner: id,
    });
    if (!shop) {
      throw new NotFoundException('shop not found');
    }
    // check if product found with similar name
    const productExists = await this.productModel.exists({
      name: data.name,
    });
    if (productExists) {
      throw new BadRequestException('product with name already exist');
    }
    /// create product
    let createData = {
      ...data,
      shopId: shop._id.toString(),
    };
    if (image) {
      createData['image'] = image;
    }
    let createdProduct = await this.productModel.create(createData);
    //updating shop products
    const products = [...shop.products, createdProduct._id.toString()];
    const result = await shop.updateOne(
      {
        products,
      },
      {
        new: true,
      },
    );
    return result;
  }
  async getShopProducts(userId: string, limit: number, offset: number) {
    // find the shop
    const shop = await this.coffeeShopModel.findOne({
      owner: userId,
    });
    if (!shop) {
      throw new NotFoundException('shop not found');
    }
    // count all products
    const counts = await this.productModel.countDocuments({
      shopId: shop._id.toString(),
    });
    //query
    const products = await this.productModel
      .find()
      .populate({ path: 'category', select: ['name', 'image'] })
      .limit(limit)
      .skip(offset);
    //pagination metadata
    const metadata=generatePaginationInfo(counts,limit,offset)
    return {
      data:{
        products
      },
      metadata
    }
  }
  async getSingleProduct(userId:string,productId:string){
    // check shop with userid with owner field exists
    const shop=await this.coffeeShopModel.findOne({
      owner:userId
    })
    if(!shop){
      throw new NotFoundException('shop not found')
    }
    // find the product
    const product=await this.productModel.findOne({
      _id:productId,
      shopId:shop._id.toString()
    }).populate({path:'category',select:['name','image']})
    if(!product){
      throw new NotFoundException('product not found')
    }
    return product
  }
  //update product
  async updateProduct(userId:string,id:string,data:UpdateProductDto,image?:string){
    //find shop of user
    const shop=await this.coffeeShopModel.findOne({
      owner:userId
    })
    if(!shop){
      throw new NotFoundException('shop not found')
    }
    // find product
    const product=await this.productModel.findById(id)
    if(!product){
      throw new NotFoundException('product not found')
    }
    // update product
    let updateData={
      ...data
    }
    if(image){
      updateData['image']=image
    }
    let result=await product.updateOne(updateData)
    return result
  }
}
