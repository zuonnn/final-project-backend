import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Request } from 'express';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Post()
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountsService.createDiscount(createDiscountDto);
  }

  @Get()
  findAll() {
    return this.discountsService.findAllDiscounts();
  }

  @Get('list_products_code')
  findAllProductsByDiscountCode(@Req() req: Request) {
    const { code, limit, page } = req.query;
    return this.discountsService.findAllProductsByDiscountCode({ code, limit, page});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountsService.findDiscountById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountsService.updateDiscount(id, updateDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountsService.deleteDiscountById(id);
  }
}
