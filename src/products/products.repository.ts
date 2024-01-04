import { DataSource } from 'typeorm';
import { Product } from './entity/product.entity';
import { InjectDataSource } from '@nestjs/typeorm';

export class ProductsRepository {
  constructor(@InjectDataSource() private datasource: DataSource) {}
  async findByMerchantTradeNo(
    merchantTradeNo: string,
  ): Promise<Product | undefined> {
    return await this.datasource
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('product.merchantTradeNo = :merchantTradeNo', {
        merchantTradeNo: merchantTradeNo,
      })
      .getOne();
  }

  async findAllProducts(): Promise<Product[]> {
    return await this.datasource
      .getRepository(Product)
      .createQueryBuilder('product')
      .orderBy('product.id', 'DESC')
      .getMany();
  }

  async findProductById(productId: number): Promise<any> {
    return await this.datasource
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('product.id = :id', { id: productId })
      .getOne();
  }

  async update(id: number, product: Partial<Product>): Promise<any> {
    await this.datasource
      .getRepository(Product)
      .createQueryBuilder()
      .update(Product)
      .set(product)
      .where('id = :id', { id })
      .execute();
  }

  async deleteProductById(id: number): Promise<any> {
    return await this.datasource
      .createQueryBuilder()
      .delete()
      .from(Product)
      .where('id = :id', { id })
      .execute();
  }

  async create(product: Partial<Product>): Promise<any> {
    return await this.datasource
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values([product])
      .execute();
  }
}
