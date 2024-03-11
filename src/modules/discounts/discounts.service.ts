import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Discount } from './entities/discount.entity';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Product } from '../products/entities/product.entity';
import { BaseServiceAbstract } from 'src/base/abstracts/base.service.abstract';
import { DiscountRepositoryInterface } from './interfaces/discount.interface';
import { ProductsService } from '../products/products.service';

@Injectable()
export class DiscountsService extends BaseServiceAbstract<Discount>{
    constructor(
        @Inject('DiscountsRepositoryInterface') private readonly discountRepository: DiscountRepositoryInterface,
        private readonly productsService: ProductsService
    ) {
        super(discountRepository);

    }
    async createDiscount(createDiscountDto: CreateDiscountDto) {
        const foundDiscountCode = await this.discountRepository.findOneByCondition({ code: createDiscountDto.code })
        if (foundDiscountCode) {
            throw new BadRequestException('Discount code already exists');
        }

        if (new Date() < createDiscountDto.start || new Date() > createDiscountDto.end) {
            throw new BadRequestException('Invalid date range')
        }

        if (new Date(createDiscountDto.start) > new Date(createDiscountDto.end)) {
            throw new BadRequestException('Invalid date range')
        }

        const newDiscount = await this.discountRepository.create({
            ...createDiscountDto,
            min_order_value: createDiscountDto.min_order_value || 0,
            product_ids: createDiscountDto.apply_to === 'alls' ? [] : createDiscountDto.product_ids,
            max_value: createDiscountDto.max_value || 0,

        });
        return newDiscount;
    }

    async findDiscountByCode(code: string) {
        return this.discountRepository.findOneByCondition({ code });
    }

    async findAllProductsByDiscountCode({
        code,
        limit,
        page
    }) {
        const discount = await this.discountRepository.findOneByCondition({ code });
        if (!discount || discount.is_active === false) {
            throw new NotFoundException('Discount not found')
        }

        let products: Product[];
        if (discount.apply_to === 'alls') {
            products = await this.productsService.findAllProduct({
                limit: +limit || 10,
                page: +page || 1,
                sort: 'ctime',
                select: ['name'],
                filter: {}
            });
        } else if (discount.apply_to === 'specifics') {
            products = await this.productsService.findAllProduct({
                limit: +limit || 10,
                page: +page || 1,
                sort: 'ctime',
                select: ['name'],
                filter: { _id: { $in: discount.product_ids } }
            });
        }
        return products;
    }

    async updateDiscount(id: string, updateDiscountDto: UpdateDiscountDto) {
        if (new Date() < updateDiscountDto.start || new Date() > updateDiscountDto.end) {
            throw new BadRequestException('Invalid date range')
        }

        if (new Date(updateDiscountDto.start) > new Date(updateDiscountDto.end)) {
            throw new BadRequestException('Invalid date range')
        }

        const foundDiscount = await this.discountRepository.findOneByCondition({ code: updateDiscountDto.code });
        if (foundDiscount && foundDiscount._id.toString() !== id) {
            throw new BadRequestException('Discount code already exists')
        }

        return this.discountRepository.update(id, updateDiscountDto);
    }

    async applyDiscountToOrder({ code, products, totalPrice, userId }) {
        const discount = await this.discountRepository.findOneByCondition({ code });
        if (!discount) {
            throw new NotFoundException('Discount not found!');
        }

        if (
            !discount.is_active ||
            new Date() < discount.start ||
            new Date() > discount.end
        ) {
            throw new BadRequestException('Discount has expired!');
        }

        //Kiểm tra số lần sử dụng tối đa mỗi user
        if (discount.max_usage_per_user) {
            const usedUser = discount.used_users.find(u => u.userId === userId);
            if (usedUser && usedUser.time >= discount.max_usage_per_user) {
                throw new BadRequestException('Discount code has reached max usage!');
            }
        }

        //Kiểm tra số lần sử dụng tối đa
        if (discount.used_count >= discount.max_usage) {
            throw new BadRequestException('Discount code has reached max usage!');
        }

        //Kiểm tra giá trị đơn hàng tối thiểu
        if (totalPrice < discount.min_order_value) {
            throw new BadRequestException('Order value is too low!');
        }

        //Kiểm tra sản phẩm áp dụng
        if (discount.apply_to === 'specifics') {
            const product_ids = products.map((p: { productId: any; }) => p.productId);
            const validProducts = discount.product_ids.filter(p => product_ids.includes(p));
            if (validProducts.length !== product_ids.length) {
                throw new BadRequestException('Discount code is not applicable to all products')
            }
        }

        //Kiểm tra loại giảm giá
        let totalDiscount = 0;
        if (discount.type === 'fixed_amount') {
            //Kiểm tra giá trị giảm giá không vượt quá giá trị đơn hàng
            totalDiscount = discount.value > totalPrice ? totalPrice : discount.value;
        } else if (discount.type === 'percentage') {
            totalDiscount = totalPrice * discount.value / 100;
        }

        return totalDiscount;
    }

    async cancelDiscountCode({ codeId, userId }) {
        const discount = await this.discountRepository.findOneById(codeId);
        if (!discount) {
            throw new NotFoundException('Discount not found')
        }
        return await this.discountRepository.findByIdAndUpdate(codeId, userId);
    }

}
