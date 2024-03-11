import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { BaseServiceAbstract } from 'src/base/abstracts/base.service.abstract';
import { ProductRepositoryInterface } from 'src/modules/products/interfaces/product.interface';
import { InventoriesService } from '../inventories/inventories.service';

@Injectable()
export class ProductsService extends BaseServiceAbstract<Product>{
  constructor(
    @Inject('ProductsRepositoryInterface') private readonly productRepository: ProductRepositoryInterface,
    private readonly inventoriesService: InventoriesService
  ) {
    super(productRepository);

  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const slug = createProductDto.name.toLowerCase().split(' ').join('-');
    const createdProduct = await this.productRepository.create({
      ...createProductDto,
      slug
    });
    if (createdProduct) {
      await this.inventoriesService.insertProductToInventory({
        product_id: createdProduct._id,
        stock: createProductDto.quantity,
      })
    }
    return createdProduct;
  }

  async findAllProduct({ filter, limit, sort, page, select }): Promise<Product[]> {
    const selectFields = select ? select.split(',').join(' ') : '';
    return await this.productRepository.findAllProduct({ filter, limit, sort, page, select: selectFields });
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.productRepository.findOneByCondition({ slug });
  }

  async searchProduct(keySearch: string): Promise<Product[]> {
    return await this.productRepository.searchByName(keySearch);
  }
}
