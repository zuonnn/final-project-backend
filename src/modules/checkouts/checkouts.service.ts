import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Checkout } from './entities/checkout.entity';
import { Model } from 'mongoose';
import { CartsService } from '../carts/carts.service';
import { ProductsService } from '../products/products.service';
import { DiscountsService } from '../discounts/discounts.service';
import { Product } from '../products/entities/product.entity';
import { BaseServiceAbstract } from 'src/base/abstracts/base.service.abstract';
import { CheckoutRepositoryInterface } from './interfaces/checkout.interface';

@Injectable()
export class CheckoutsService extends BaseServiceAbstract<Checkout>{
  constructor(
    @Inject('CheckoutsRepositoryInterface') private readonly checkoutRepository: CheckoutRepositoryInterface,
    private cartsService: CartsService,
    private productService: ProductsService,
    private discountsService: DiscountsService
  ) {
    super(checkoutRepository);
  }

  async checkoutReview({
    cart_id,
    user_id,
    discount_code,
  }) {
    //Kiểm tra giỏ hàng có tồn tại không
    const cart = await this.cartsService.findOne(cart_id);
    if (!cart) throw new NotFoundException('Cart not found');

    //Kiểm tra giỏ hàng có thuộc về user không
    if (cart.user_id !== user_id) throw new NotFoundException('Cart not found');

    //Kiểm tra giỏ hàng có sản phẩm không
    if (cart.products.length === 0) throw new NotFoundException('Cart is empty');

    const order = {
      total_price: 0,
      discount: 0,
      fee_ship: 0,
      total_checkout: 0
    }
    let productDescription: Product;
    //Tính tổng giá sản phẩm
    for (const product of cart.products) {
      //Kiểm tra sản phẩm có tồn tại không
      productDescription = await this.productService.findOne(String(product.product_id));
      if (!productDescription) throw new NotFoundException('Product not found');

      //Tính tổng giá sản phẩm
      order.total_price += productDescription.price * product.quantity;
    }
    //Tính giá discount
    order.discount = await this.discountsService.applyDiscountToOrder({ code: discount_code, user_id, total_price: order.total_price, products: cart.products });
    //Tính tổng giá đơn hàng
    order.total_checkout = order.total_price - order.discount;
    return {
      order,
      products: cart.products
    };
  }

  async orderByUser({
    cart_id,
    user_id,
    user_address = {},
    user_payment = {},
    discount_code,
  }) {
    const {order,  products} = await this.checkoutReview({
      cart_id,
      user_id,
      discount_code
    })
    console.log("Order" + order);
    console.log("Products" + products);
  }
}
