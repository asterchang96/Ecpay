import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT), // PostgreSQL 默認端口
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // entities: [__dirname, '**', '*.entity.{ts,js}'],
      synchronize: true, // 在開發環境中使用，生產環境中應該關閉
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
