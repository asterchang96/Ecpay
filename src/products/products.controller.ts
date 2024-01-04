import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entity/product.entity';
import { CreateProductDto, GetECPayResultDto } from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Post2ecpay
  @Get('/order/:id')
  async getECPayForm(@Param('id') id: number): Promise<string> {
    return await this.productsService.getECPayForm(id);
  }

  // ecpay back result to server
  @Post('/order/result')
  async getECPayResult(
    @Body() getECPayResultDto: GetECPayResultDto,
  ): Promise<any> {
    return await this.productsService.getECPayResult(getECPayResultDto);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product> {
    return await this.productsService.findOne(id);
  }

  //delete
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    return await this.productsService.delete(id);
  }

  // 建立訂單
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.create(createProductDto);
  }
}
