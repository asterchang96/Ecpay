import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import * as dotenv from 'dotenv';
import { DatabaseConfig } from './config/database.config';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private readonly logger: Logger = new Logger(AppModule.name);
  constructor() {
    this.logger.log('AppModule initialized');
    this.logger.log('DB_HOST:', process.env.DB_HOST);
    this.logger.log('DB_USER:', process.env.DB_USER);
    this.logger.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    this.logger.log('DB_DATABASE:', process.env.DB_DATABASE);
  }
}
