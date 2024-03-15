import { Controller, Post, Body, Param, Delete, Patch, Get } from '@nestjs/common';
import { CartsService } from './carts.service';
import { ProductData } from './interfaces/product-data.interface';
import mongoose from 'mongoose';
import { CartDto } from './dto/create-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Post('add')
  addToCart(@Body() cartDto: CartDto) {
    return this.cartsService.addToCart(cartDto);
  }

  @Get('increase')
  increaseProductQuantity(@Body() cartDto: CartDto) {
    return this.cartsService.increaseProductQuantity(cartDto);
  }

  @Get('decrease')
  decreaseProductQuantity(@Body() cartDto: CartDto) {
    return this.cartsService.decreaseProductQuantity(cartDto);
  }

  @Delete('remove')
  removeProductFromCart(@Body() cartDto: CartDto) {
    return this.cartsService.removeProductFromCart(cartDto);
  }
}
