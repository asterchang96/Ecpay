import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entity/product.entity';
import {
  CreateProductDto,
  GetECPayResultDto,
  ApiResponseDto,
} from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Post2ecpay
  @Get('/order/:id')
  getECPayForm(@Param('id') id: number): Promise<string> {
    return this.productsService.getECPayForm(id);
  }

  // ecpay back result to server
  @Post('/order/result')
  getECPayResult(
    @Body() getECPayResultDto: GetECPayResultDto,
  ): Promise<ApiResponseDto> {
    return this.productsService.getECPayResult(getECPayResultDto);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<ApiResponseDto> {
    return this.productsService.delete(id);
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }
}
