import { DataSource, Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { InjectDataSource } from '@nestjs/typeorm';

export class ProductRepository {
  constructor(@InjectDataSource() private datasource: DataSource) {}

  async findByMerchantTradeNo(
    merchantTradeNo: string,
  ): Promise<Product | undefined> {
    return await this.datasource.createQueryBuilder()
      .from(Product, 'product')
      .where('product.merchantTradeNo = :merchantTradeNo', {
        merchantTradeNo: merchantTradeNo,
      })
      .getOne();
  }
  async findAllProduct(): Promise<Product[]> {
    return await this.datasource.createQueryBuilder().getMany();
  }

}
