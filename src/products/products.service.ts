import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ){}
  
  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product[]> {
    return await this.productsRepository.findOne({ where : { id }});
  }

  async create(product: Product): Promise<Product> {
    const newProduct = await this.productsRepository.create(product);
    return await this.productsRepository.save(newProduct);
  }
  
}
