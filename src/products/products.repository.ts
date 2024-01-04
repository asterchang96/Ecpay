import { DataSource } from 'typeorm';
import { Product } from './entity/product.entity';
import { InjectDataSource } from '@nestjs/typeorm';

export class ProductsRepository {
  constructor(@InjectDataSource() private datasource: DataSource) {}

  async findByMerchantTradeNo(
    merchantTradeNo: string,
  ): Promise<Product | undefined> {
    return await this.datasource
      .createQueryBuilder()
      .from(Product, 'product')
      .where('product.merchantTradeNo = :merchantTradeNo', {
        merchantTradeNo: merchantTradeNo,
      })
      .getOne();
  }
  async findAllProducts(): Promise<Product[]> {
    return await this.datasource.createQueryBuilder().getMany();
  }

  async findProductById(productId: number): Promise<any> {
    // return productId;
    return await this.datasource
      .createQueryBuilder()
      .from(Product, 'product')
      .where('product.id = :productId', { productId })
      .getOne();
  }

  async update(productId: number, product: Partial<Product>): Promise<any> {
    await this.datasource
      .createQueryBuilder()
      .update(Product)
      .set(product)
      .where('id = :id', { productId })
      .execute();
  }

  async delete(productId: number): Promise<any> {
    await this.datasource
      .createQueryBuilder()
      .delete()
      .from(Product, 'product')
      .where('id = :id', { productId })
      .execute();
  }

  async create(product: Partial<Product>): Promise<any> {
    await this.datasource
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(product)
      .execute();
  }
}
