import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './entities/cart.entity';
import { Model } from 'mongoose';
import { ProductsService } from '../products/products.service';
import { InventoriesService } from '../inventories/inventories.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    private readonly productService: ProductsService,
    private readonly inventoriesService: InventoriesService
  ) { }

  async createUserCart({ userId, productData }) {
    const query = { userId: userId, state: 'active' },
      updateOrInsert = {
        $addToSet: { products: productData },
        $setOnInsert: {count: 1}
      }, options = { upsert: true, new: true };
    return this.cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  async addProductToCart({ userId, product }) {
  }


  async removeProductFromCart({ userId, productId }) {
  }

  async getUserCart({ userId }) {
    return this.cartModel.findOne({ userId, state: 'active' });
  }

  async findCartById({ cartId }) {
    return this.cartModel.findOne({ _id: cartId, state: 'active' });
  }
}
