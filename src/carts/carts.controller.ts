import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  addToCart(@Body() {userId, product}) {
    return this.cartsService.addProductToCart({userId, product});
  }

  @Delete()
  removeFromCart(@Body() {userId, productId}) {
    return this.cartsService.removeProductFromCart({userId, productId});
  }
  
}
