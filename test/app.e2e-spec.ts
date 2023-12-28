import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  
  it('/products (GET)', async () => {
    // 假設你有一個測試用的 Product
    const testProduct = { /* 你的測試 Product 物件 */ };

    // 創建產品 (create 方法的測試)
    const createdProduct = await request(app.getHttpServer())
      .post('/products')
      .send(testProduct)
      .expect(201);  // 假設成功創建會返回 201

    // 查詢所有產品 (findAll 方法的測試)
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    const products: Product[] = response.body;
    expect(Array.isArray(products)).toBe(true);  // 確保返回值為陣列
    expect(products.length).toBeGreaterThanOrEqual(1);  // 確保至少返回一個產品

    // 清理測試數據 (delete 方法的測試)
    await request(app.getHttpServer())
      .delete(`/products/${createdProduct.body.id}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
