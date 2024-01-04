import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsRepository } from './products.repository';
import { Product } from './entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsRepository, Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
