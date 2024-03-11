import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/base/entities/base.entity';

export type DiscountDocument = HydratedDocument<Discount>;

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})
export class Discount extends BaseEntity {
    @Prop({ required: true })
    name: string;//Tên giảm giá

    @Prop({ required: true })
    description: string;//Mô tả giảm giá

    @Prop({ required: true, default: 'fixed_amount', enum: ['fixed_amount', 'percentage'] })
    type: string;//Loại giảm giá

    @Prop({ required: true })
    value: number;//Giá trị giảm giá

    @Prop({ required: true })
    max_value: number;//Giá trị tối đa áp dụng

    @Prop({ required: true, unique: true })
    code: string;//Mã giảm giá

    @Prop({ required: true })
    start: Date;//Ngày bắt đầu

    @Prop({ required: true })
    end: Date;//Ngày kết thúc

    @Prop({ required: true })
    max_usage: number;//Số lần sử dụng tối đa

    @Prop({ required: true })
    max_usage_per_user: number;//Số lần sử dụng tối đa mỗi user

    @Prop({ type: [{ _id: false, userId: mongoose.Schema.Types.ObjectId, time: Number }], default: [] })
    used_users: { userId: mongoose.Schema.Types.ObjectId, time: number }[];


    @Prop({ default: 0 })
    used_count: number;//Số lần đã sử dụng

    @Prop({ required: true })
    min_order_value: number;//Giá trị đơn hàng tối thiểu được phép áp mã

    @Prop({ default: true })
    is_active: boolean;//Trạng thái hoạt động

    @Prop({ required: true, default: 'all', enum: ['all', 'specifics'] })
    apply_to: string;//Áp dụng cho tất cả sản phẩm hoặc chỉ áp dụng cho một số sản phẩm cụ thể

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], default: [] })
    product_ids: mongoose.Schema.Types.ObjectId[]; // Danh sách sản phẩm áp dụng nếu apply_to là specifics
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);