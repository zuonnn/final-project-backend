import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Checkout } from './schemas/checkout.schema';
import { Model } from 'mongoose';
import { CartsService } from '../carts/carts.service';
import { ProductsService } from '../products/products.service';
import { DiscountsService } from '../discounts/discounts.service';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CheckoutsService {
  constructor(
    @InjectModel(Checkout.name) private checkoutModel: Model<Checkout>,
    private cartsService: CartsService,
    private productService: ProductsService,
    private discountsService: DiscountsService
  ) { }

  async checkoutReview({
    cartId,
    userId,
    discountCode,
  }) {
    //Kiểm tra giỏ hàng có tồn tại không
    const cart = await this.cartsService.findCartById(cartId);
    if (!cart) throw new NotFoundException('Cart not found');

    //Kiểm tra giỏ hàng có thuộc về user không
    if (cart.userId !== userId) throw new NotFoundException('Cart not found');

    //Kiểm tra giỏ hàng có sản phẩm không
    if (cart.products.length === 0) throw new NotFoundException('Cart is empty');

    const order = {
      totalPrice: 0,
      discount: 0,
      totalCheckout: 0
    }
    let productDescription: Product;
    //Tính tổng giá sản phẩm
    for (const product of cart.products) {
      //Kiểm tra sản phẩm có tồn tại không
      productDescription = await this.productService.findOne(product.productId);
      if (!productDescription) throw new NotFoundException('Product not found');

      //Tính tổng giá sản phẩm
      order.totalPrice += productDescription.price * product.quantity;
    }
    //Tính giá discount
    order.discount = await this.discountsService.applyDiscountToOrder({ code: discountCode, userId, totalPrice: order.totalPrice, products: cart.products });
    //Tính tổng giá đơn hàng
    order.totalCheckout = order.totalPrice - order.discount;
    return order;
  }

  async orderByUser({
    cartId,
    userId,
    user
  }) {

  }
}
