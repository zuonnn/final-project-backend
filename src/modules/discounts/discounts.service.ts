import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Discount, DiscountDocument } from './schemas/discount.schema';
import { Model } from 'mongoose';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class DiscountsService {
    constructor(
        @InjectModel(Discount.name) private discountModel: Model<Discount>,
        private productsService: ProductsService
    ) { }
    async createDiscount(createDiscountDto: CreateDiscountDto) {
        const foundDiscountCode = await this.discountModel.findOne({ code: createDiscountDto.code }).exec();
        if (foundDiscountCode) {
            throw new BadRequestException('Discount code already exists');
        }

        if (new Date() < createDiscountDto.start || new Date() > createDiscountDto.end) {
            throw new BadRequestException('Invalid date range')
        }

        if (new Date(createDiscountDto.start) > new Date(createDiscountDto.end)) {
            throw new BadRequestException('Invalid date range')
        }

        const newDiscount = new this.discountModel({
            ...createDiscountDto,
            minOrderValue: createDiscountDto.minOrderValue || 0,
            productIds: createDiscountDto.applyTo === 'alls' ? [] : createDiscountDto.productIds,
            maxValue: createDiscountDto.maxValue || 0,

        });
        return newDiscount.save();
    }

    async findAllDiscounts() {
        return this.discountModel.find().exec();
    }

    async findDiscountById(id: string) {
        return this.discountModel.findById(id).exec();
    }

    async findDiscountByCode(code: string) {
        return this.discountModel.findOne({ code }).exec();
    }

    async findAllProductsByDiscountCode({
        code,
        limit,
        page
    }) {
        const discount = await this.discountModel.findOne({ code }).exec();
        if (!discount || discount.isActive === false) {
            throw new NotFoundException('Discount not found')
        }

        let products = [];
        if (discount.applyTo === 'alls') {
            products = await this.productsService.findAllProduct({
                limit: +limit || 10,
                page: +page || 1,
                sort: 'ctime',
                select: ['name'],
                filter: {}
            });
        } else if (discount.applyTo === 'specifics') {
            products = await this.productsService.findAllProduct({
                limit: +limit || 10,
                page: +page || 1,
                sort: 'ctime',
                select: ['name'],
                filter: { _id: { $in: discount.productIds } }
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

        const foundDiscount = await this.discountModel.findOne({ code: updateDiscountDto.code });
        if (foundDiscount && foundDiscount._id.toString() !== id) {
            throw new BadRequestException('Discount code already exists')
        }

        return this.discountModel.findByIdAndUpdate(id, updateDiscountDto, { new: true }).exec();
    }

    async deleteDiscountById(id: string) {
        return this.discountModel.findByIdAndDelete(id).exec();
    }

    async deleteDiscountByCode(code: string) {
        return this.discountModel.findOneAndDelete({ code }).exec();
    }

    async cancelDiscountCode({ codeId, userId }) {
        const discount = await this.discountModel.findById(codeId).exec();
        if (!discount) {
            throw new NotFoundException('Discount not found')
        }

        const result = await this.discountModel.findByIdAndUpdate(discount._id, {
            $pull: {
                usedUsers: userId
            },
            $inc: {
                usedCount: -1
            }
        }).exec();

        return result;
    }

    async applyDiscountToOrder({ code, products, totalPrice, userId }) {
        const discount = await this.discountModel.findOne({ code }).exec();
        if (!discount ||
            !discount.isActive ||
            new Date() < discount.start ||
            new Date() > discount.end ||
            !discount.maxUsage
        ) {
            throw new NotFoundException('Discount not found')
        }

        //Kiểm tra số lần sử dụng tối đa mỗi user
        if (discount.maxUsagePerUser) {
            const usedUser = discount.usedUsers.find(u => u.userId === userId);
            if (usedUser && usedUser.time >= discount.maxUsagePerUser) {
                throw new BadRequestException('Discount code has reached max usage')
            }
        }

        //Kiểm tra số lần sử dụng tối đa
        if (discount.usedCount >= discount.maxUsage) {
            throw new BadRequestException('Discount code has reached max usage')
        }

        //Kiểm tra giá trị đơn hàng tối thiểu
        if (totalPrice < discount.minOrderValue) {
            throw new BadRequestException('Order value is too low')
        }

        //Kiểm tra sản phẩm áp dụng
        if (discount.applyTo === 'specifics') {
            const productIds = products.map((p: { productId: any; }) => p.productId);
            const validProducts = discount.productIds.filter(p => productIds.includes(p));
            if (validProducts.length !== productIds.length) {
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

}
