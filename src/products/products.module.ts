import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { Product } from './entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository, Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
