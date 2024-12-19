import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductCategoryDto } from 'src/dto/product/productcategory.dto';
import { ProductCategory } from 'src/schemas/product.category.schema';
import { Product } from 'src/schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(ProductCategory.name)
    private readonly categoryModel: Model<ProductCategory>,
  ) {}

  async createCategory(body: ProductCategoryDto, image?: string) {
    let data = {
      ...body,
    };
    if (image) {
        data['image']=image
    }
    const category = await this.categoryModel.create(data);
    return category;
  }

  async getALlCategories(limit?: number, offset?: number) {
    return await this.categoryModel.find().limit(limit).skip(offset);
  }
}
