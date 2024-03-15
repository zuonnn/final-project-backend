import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { ProductsService } from '../products/products.service';
import { InventoriesService } from '../inventories/inventories.service';
import { CartRepositoryInterface } from './interfaces/cart.interface';
import { BaseServiceAbstract } from 'src/base/abstracts/base.service.abstract';

@Injectable()
export class CartsService extends BaseServiceAbstract<Cart>{
  constructor(
    @Inject('CartsRepositoryInterface') private readonly cartRepository: CartRepositoryInterface,
    private readonly productService: ProductsService,
    private readonly inventoriesService: InventoriesService
  ) {
    super(cartRepository);
  }

  async addToCart({ user_id, product }) {
    try {
        const { product_id, quantity } = product;

        // Check if product exists
        const productExists = await this.productService.findOne(product_id);
        if (!productExists) {
            throw new NotFoundException('Product not found');
        }

        // Check if user has an active cart
        let userCart = await this.cartRepository.findOneByCondition({ user_id, state: 'active' });

        // If user has no active cart, create one
        if (!userCart) {
            return this.cartRepository.createUserCart({ user_id, product });
        }

        // If user has an active cart, check if product is already in cart
        const productIndex = userCart.products.findIndex((product) => product.product_id.toString() === product_id);

        // If product is not in cart, add it
        if (productIndex === -1) {
            return this.cartRepository.addProductToCart({ user_id, product });
        } else {
            // If product is already in cart, update its quantity
            const inventory = await this.inventoriesService.findByProductId(product_id);

            if (inventory.stock < quantity + userCart.products[productIndex].quantity) {
                throw new NotFoundException('Product out of stock');
            }

            return await this.cartRepository.updateProductQuantity({ user_id, product_id, quantity });
        }
    } catch (error) {
        throw new InternalServerErrorException(error.message);
    }
}


  async increaseProductQuantity({ user_id, product }) {
    try {
      const { product_id } = product;
      // Check if product exists
      const productExists = await this.productService.findOne(product_id);
      if (!productExists) {
        throw new NotFoundException('Product not found');
      }
      // Check if stock is available
      const inventory = await this.inventoriesService.findByProductId(product_id);
      if (inventory.stock < 1) {
        throw new NotFoundException('Product out of stock');
      }
      return await this.cartRepository.updateProductQuantity({ user_id, product_id, quantity: 1 });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async decreaseProductQuantity({ user_id, product }) {
    try {
      const { product_id, quantity } = product;
      const productExists = await this.productService.findOne(product_id);
      if (!productExists) {
        throw new NotFoundException('Product not found');
      }
      if (quantity === 1) {
        return await this.cartRepository.removeProductFromCart({ user_id, product });
      }
      return await this.cartRepository.updateProductQuantity({ user_id, product_id, quantity: -1 });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async removeProductFromCart({ user_id, product }) {
    return await this.cartRepository.removeProductFromCart({ user_id, product });
  }

}
