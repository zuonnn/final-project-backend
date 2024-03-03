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

  async createUserCart({ userId, productData }) {
    const query = { userId: userId, state: 'active' },
      updateOrInsert = {
        $addToSet: { products: productData },
        $setOnInsert: {count: 1}
      }, options = { upsert: true, new: true };
    return this.cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  async addProductToCart({ userId, product }) {
    const { productId, quantity } = product;
    // Kiểm tra sản phẩm có tồn tại không
    const productDescription = await this.productService.findProductById(productId);
    if (!productDescription) throw new NotFoundException('Product not found');
    const productData = {productId, quantity, price: productDescription.price};

    // Kiểm tra số lượng sản phẩm còn đủ không
    if (productDescription.quantity < quantity) throw new NotFoundException('Product out of stock');
    // Kiểm tra giỏ hàng của user có tồn tại không
    let userCart = await this.getUserCart({ userId });
    // Nếu không có giỏ hàng thì tạo mới
    if (!userCart) {
      userCart = await this.createUserCart({ userId, productData });
    } else {
      // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
      const productIndex = userCart.products.findIndex(p => p.productId === productId);
      // Nếu có thì cập nhật số lượng
      if (productIndex !== -1) {
        userCart.products[productIndex].quantity += quantity;
      } else {
        // Nếu chưa có thì thêm mới
        userCart.products.push(productData);
      }
      // Cập nhật giỏ hàng vào cơ sở dữ liệu
      await this.cartModel.updateOne(
        { userId, state: 'active' },
        {
          $set: { products: userCart.products, count: userCart.products.length}
        }
      );
    }
    return userCart;
  }


  async removeProductFromCart({ userId, productId }) {
    const query = { userId: userId, state: 'active' },
      updateSet = {
        $pull: { products: { productId } },
        $inc: { count: -1 }
      }

    const deleteCart = await this.cartModel.updateOne(query, updateSet);

    return deleteCart;
  }

  async getUserCart({ userId }) {
    return this.cartModel.findOne({ userId, state: 'active' });
  }

  async findCartById({ cartId }) {
    return this.cartModel.findOne({ _id: cartId, state: 'active' });
  }
}
