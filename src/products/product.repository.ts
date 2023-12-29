import { EntityRepository, Repository } from 'typeorm';
import { Product } from './product.entity';
import { UpdateECPayResultDto } from './product.dto';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async findById(id: number): Promise<Product | undefined> {
    return await this.findOne({ where: { id: id } });
  }

  async findProducts(): Promise<Product[]> {
    try {
      console.log('Before find'); // 添加这行日志
      const result = await this.find();
      console.log('After find'); // 添加这行日志
      return result;
    } catch (error) {
      console.error('Error in findProducts', error); // 添加这行日志
      throw error;
    }
  }

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

  async updateProduct(
    id: number,
    updatedData: UpdateECPayResultDto,
  ): Promise<any> {
    return await this.createQueryBuilder()
      .update(Product)
      .set({ ...updatedData })
      .where('id = :id', { id: id })
      .execute();
  }
}
