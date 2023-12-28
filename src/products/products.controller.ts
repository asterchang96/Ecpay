import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService){}

  // Post2ecpay
  @Get('/order/:id')
  async getECPayForm(@Param('id') id: number): Promise<string> {
    return await this.productsService.getECPayForm(id);
  }

  // ecpay back result to server
  @Post('/order/result')
  async getECPayResult(@Body() requestBody: any): Promise<any>  {
    return await this.productsService.getECPayResult(requestBody);
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

  //delete 
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new Error('product not found');
    }
    return this.productsService.delete(id);
  }

  // 建立訂單
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.create(createProductDto);
  }
  
}
