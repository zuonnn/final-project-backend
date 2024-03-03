import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private productService: ProductsService,
  ) { }

  async createUserCart({ userId, product }) {
    const query = { userId: userId, state: 'active' },
      updateOrInsert = {
        $addToSet: { products: product },
        $setOnInsert: { count: product.quantity }
      }, options = { upsert: true, new: true };
    return this.cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  async addProductToCart({ userId, product }) {
    const { productId, quantity } = product;
    // Kiểm tra sản phẩm có tồn tại không
    const productDescription = await this.productService.findProductById(productId);
    if (!productDescription) throw new NotFoundException('Product not found');
    // Kiểm tra số lượng sản phẩm còn đủ không
    if (productDescription.quantity < quantity) throw new NotFoundException('Product out of stock');
    // Kiểm tra giỏ hàng của user có tồn tại không
    let userCart = await this.getUserCart({ userId });
    // Nếu không có giỏ hàng thì tạo mới
    if (!userCart) {
      userCart = await this.createUserCart({ userId, product });
    } else {
      // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
      const productIndex = userCart.products.findIndex(p => p.productId === productId);
      // Nếu có thì cập nhật số lượng
      if (productIndex !== -1) {
        userCart.products[productIndex].quantity += quantity;
      } else {
        // Nếu chưa có thì thêm mới
        userCart.products.push(product);
      }
      // Cập nhật giỏ hàng vào cơ sở dữ liệu
      await this.cartModel.updateOne(
        { userId, state: 'active' },
        {
          $set: { products: userCart.products },
          $inc: { count: quantity }
        }
      );
    }
    return userCart;
  }


  async removeProductFromCart({ userId, productId }) {
    const query = { userId: userId, state: 'active' },
      updateSet = {
        $pull: { products: { productId } },
      }

    const deleteCart = await this.cartModel.updateOne(query, updateSet);

    return deleteCart;
  }

  async getUserCart({ userId }) {
    return this.cartModel.findOne({ userId, state: 'active' });
  }
}
