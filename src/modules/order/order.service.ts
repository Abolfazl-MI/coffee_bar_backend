import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { skip } from 'node:test';
import { OrderDto, UpdateOrderDto } from 'src/dto/orders/order.dto';
import { CoffeeShop } from 'src/schemas/coffeShop.schema';
import { Order } from 'src/schemas/order.schema';
import { Product } from 'src/schemas/product.schema';
import { generatePaginationInfo } from 'src/utils/functions';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(CoffeeShop.name) private readonly shopModel: Model<CoffeeShop>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  //create order
  async createOrder(ownerId: string, orderData: OrderDto) {
    let products: Product[] = await this.productModel.find({
      _id: {
        $in: orderData.productIds,
      },
    });
    const totalAmount = products.reduce(
      (sum: number, product: Product) => sum + product.price,
      0,
    );
    const order = await this.orderModel.create({
      ...orderData,
      totalAmount,
    });
    return order;
  }
  // get all orders
  async getAllShopOrders(ownerId: string, limit: number, offset: number) {
    const shop = await this.shopModel.findOne({
      owner: ownerId,
    });
    if (!shop) {
      throw new NotFoundException('shop not found');
    }
    const totalOrderCount = await this.orderModel.countDocuments({
      shopId: shop._id.toString(),
    });
    const orders = await this.orderModel
      .find({
        shopId: shop._id.toString(),
      })
      .limit(limit)
      .skip(offset);
    const metadata = generatePaginationInfo(totalOrderCount, limit, offset);
    return {
      data: [orders],
      metadata,
    };
  }
  async getSingleShopOrder(ownerId: string, id: string) {
    const shop = await this.shopModel.findOne({
      owner: ownerId,
    });
    if (!shop) {
      throw new NotFoundException('shop not found');
    }
    const order = await this.orderModel.findOne({
      shopId: shop._id.toString(),
      _id: id,
    });
    if (!order) {
      throw new NotFoundException('order not found');
    }
    return {
      data: [order],
    };
  }
  async updateOrder(id: string, ownerId: string, data: UpdateOrderDto) {
    const shop = await this.shopModel.findOne({
      owner: ownerId,
    });
    if (!shop) {
      throw new NotFoundException('shop not found');
    }
    const order = await this.orderModel.findOne({
      shopId: shop._id.toString(),
      _id: id,
    });
    if (!order) {
      throw new NotFoundException('order not found');
    }
    const incomingProductIds = data.productIds || [];
    const existingProductIds = order.productIds.map((p) => p.toString());
    const toRemove = existingProductIds.filter((id) =>
      incomingProductIds.includes(id),
    );
    const toAdd = incomingProductIds.filter(
      (id) => !existingProductIds.includes(id),
    );

    const productToAdd = await this.productModel.find({
      _id: {
        $in: toAdd,
      },
    });
    const productToRemove = await this.productModel.find({
      _id: {
        $in: toRemove,
      },
    });
    const addedAmount = productToAdd.reduce(
      (sum, product) => sum + product.price,
      0,
    );
    const removedAmount = productToRemove.reduce(
      (sum, product) => sum + product.price,
      0,
    );
    const finalAmount=order.totalAmount+addedAmount-removedAmount
    const updatedProductIds=existingProductIds.filter(id=>!toRemove.includes(id)).concat(toAdd)
    const orderStatus=data.status?data.status:order.status
  let result=  await order.updateOne({
        productIds:updatedProductIds,
        status:orderStatus,
        totalAmount:finalAmount
    })
    return result
  }
}
