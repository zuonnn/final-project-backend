import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartsService } from '../carts/carts.service';
import { ProductsService } from '../products/products.service';
import { DiscountsService } from '../discounts/discounts.service';
import { Product } from '../products/entities/product.entity';
import { BaseServiceAbstract } from 'src/base/abstracts/base.service.abstract';
import { CheckoutRepositoryInterface } from './interfaces/checkout.interface';
import { RedisService } from '../redis/redis.service';
import { Order } from './entities/order.entity';

@Injectable()
export class CheckoutsService extends BaseServiceAbstract<Order>{
  constructor(
    @Inject('CheckoutsRepositoryInterface') private readonly checkoutRepository: CheckoutRepositoryInterface,
    private cartsService: CartsService,
    private productService: ProductsService,
    private discountsService: DiscountsService,
    private redisService: RedisService,
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
    const {order, products} = await this.checkoutReview({
      cart_id,
      user_id,
      discount_code
    })
    console.log("Order" + order);
    console.log("Products" + products);
    
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { product_id, quantity } = products[i];
      const keyLock = await this.redisService.aquireLock({ product_id, quantity, cart_id });
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await this.redisService.releaseLock(keyLock);
      }
    }

    if (acquireProduct.includes(false)) {
      throw new NotFoundException('Some product is updated, please try again');
    }

    const newOrder = await this.checkoutRepository.create({
      user_id,
      checkout_info: {
        total_price: order.total_price,
        discount: order.discount,
        fee_ship: order.fee_ship,
        total_checkout: order.total_checkout
      },
      shipping_info: user_address,
      payment_info: user_payment,
      products,
    });

    
    if (newOrder) {
      let product = {};
      //remove product from cart
      for (let i = 0; i < products.length; i++) {
        product = {
          product_id: products[i].product_id,
          quantity: products[i].quantity
        }
        await this.cartsService.removeProductFromCart({ user_id, product });
      }
    }
  }

  async getOrdersByUser(user_id: string) {
    return this.checkoutRepository.findAll({ user_id })
  }

  async getOneOrderByUser(user_id: string) {
    return this.checkoutRepository.findOneByCondition({ user_id })
  }

  async getOrderById(order_id: string) {
    return this.checkoutRepository.findOneByCondition({ _id: order_id })
  }

  async updateOrderStatus(order_id: string, status: string) {
    return this.checkoutRepository.update(order_id, { status })
  }

  async cancelOrder(order_id: string) {
    return this.checkoutRepository.update(order_id, { status: 'cancelled' })
  }

}
