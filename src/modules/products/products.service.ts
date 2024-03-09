import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const slug = createProductDto.name.toLowerCase().split(' ').join('-');
    const createdProduct = new this.productModel({
      ...createProductDto,
      slug,
    });
    return createdProduct.save();
  }


  async findAllProduct({ limit, sort, page, select, filter }): Promise<Product[]> {
    const skip = (page - 1) * limit;
    let sortBy: Record<string, SortOrder> = {};

    if (sort) {
      if (sort === 'ctime') {
        sortBy.createdAt = -1;
      } else {
        const [key, order] = sort.split('_');
        sortBy[key] = order === 'desc' ? -1 : 1;
      }
    } else {
      sortBy.createdAt = -1;
    }

    const selectFields = Object.fromEntries(select.map((field) => [field, 1]));

    const products = await this.productModel
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(selectFields)
      .exec();
    return products;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.productModel.findOne({ slug }).exec();
  }

  async findProductById(id: string): Promise<Product | null> {
    return this.productModel.findById(id).exec();
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product | null> {
    const existingProduct = await this.productModel.findById(id).exec();

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    existingProduct.set(updateProductDto);
    return existingProduct.save();
  }

  async removeProduct(id: string): Promise<Product | null> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();

    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return deletedProduct;
  }
}
