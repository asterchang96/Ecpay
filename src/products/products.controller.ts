import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService){}

  @Get('/order')
  getECPayForm(): string {
    return this.productsService.getECPayForm();
  }

  @Post('/result')
  getECPayResult(@Body() requestBody: any): any {
    return this.productsService.getECPayResult(requestBody);
  }
  
  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product> {
    const product = await this.productsService.findOne(id);
    if(!product){
      throw new Error(`Product ${id} not found`);
    } else {
      return product;
    }
  }

  @Post()
  async create(@Body() product: Product): Promise<Product> {
    return await this.productsService.create(product);
  }
  
}
