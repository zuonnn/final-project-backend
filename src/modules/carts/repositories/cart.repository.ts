import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from 'src/base/repositories/base.abstract.repository';
import { Cart } from 'src/modules/carts/entities/cart.entity';
import { CartRepositoryInterface } from 'src/modules/carts/interfaces/cart.interface';

@Injectable()
export class CartsRepository
  extends BaseRepositoryAbstract<Cart>
  implements CartRepositoryInterface {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,
  ) {
    super(cartModel);
  }

  async createUserCart({ user_id, product }) {
    const query = { user_id: user_id, state: 'active' },
      updateOrInsert = {
        $addToSet: { products: product },
        $setOnInsert: { count: product.quantity }
      }, options = { upsert: true, new: true };
    return this.cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  async updateProductQuantity({ user_id, product_id, quantity }) {
    const query = {
      user_id: user_id,
      "products.product_id": product_id,
      state: 'active'
    };
    const update = {
      $inc: { 
        "products.$.quantity": quantity,
        count: quantity
       }
    };
    const options = { upsert: true, new: true };
    return this.cartModel.findOneAndUpdate(query, update, options);
  }


  async removeProductFromCart({ user_id, product }) {
    const query = { user_id: user_id, state: 'active' },
      update = {
        $pull: { products: { product_id: product.product_id } },

      },
      options = { new: true };
    return this.cartModel.findOneAndUpdate(query, update, options);
  }

  async addProductToCart({ user_id, product }: { user_id: any; product: any; }) {
    const query = { user_id: user_id, state: 'active' },
      updateOrInsert = {
        $addToSet: { products: product },
        $inc: { count: product.quantity }
      }, options = { upsert: true, new: true };
    return this.cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }
}
