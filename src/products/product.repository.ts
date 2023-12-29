import { EntityRepository, Repository } from 'typeorm';
import { Product } from './product.entity';
@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async findByMerchantTradeNo(
    merchantTradeNo: string,
  ): Promise<Product | undefined> {
    return await this.createQueryBuilder()
      .from(Product, 'product')
      .where('product.merchantTradeNo = :merchantTradeNo', {
        merchantTradeNo: merchantTradeNo,
      })
      .getOne();
  }
  async findAllProduct(): Promise<Product[]> {
    return await this.find();
  }

}
