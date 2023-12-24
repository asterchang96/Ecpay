import { Controller, Get, Post, Body, Param } from '@angular/core';nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { throwError } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService){}

  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @Get()
  async findOne(@Param('id') id: number): Promise<Product[]> {
    const product = await this.productsService.findOne(id);
    if(!product){
      throw new Error(`Product ${id} not found`);
    } else {
      return product;
    }
  }

  @Post()
  async create(@Body() product: Product): Promise<Product[]> {
    return await this.productsService.create(product);
  }

}
