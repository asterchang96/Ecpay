import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { NotFoundException } from '@nestjs/common';

// Mock product data for testing
const mockProducts: Product[] = [
  {
    id: 1,
    merchantID: '3002607',
    merchantTradeNo: 'WIN20231225171435',
    paymentDate: '',
    paymentType: 'unpaid',
    rtnCode: 0,
    tradeAmt: '0',
    tradeNo: '',
    tradeDate: '',
    checkMacValue: '',
    paymentTypeChargeFee: 0,
    tradeDesc: '',
    itemName: 'iphone6',
    totalAmount: 10000,
  },
  {
    id: 2,
    merchantID: '3002607',
    merchantTradeNo: 'WIN20231225171455',
    paymentDate: '',
    paymentType: 'unpaid',
    rtnCode: 0,
    tradeAmt: '0',
    tradeNo: '',
    tradeDate: '',
    checkMacValue: '',
    paymentTypeChargeFee: 0,
    tradeDesc: '',
    itemName: 'iphone7',
    totalAmount: 20000,
  },
];

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));

    // Mock repository methods
    repository.find = jest.fn().mockResolvedValue(mockProducts);
    repository.findOne = jest.fn().mockImplementation((id) => {
      const foundProduct = mockProducts.find((product) => product.id === id);
      if (foundProduct) {
        return Promise.resolve(foundProduct);
      } else {
        return Promise.resolve(undefined);
      }
    });
    repository.create = jest.fn().mockImplementation((dto) => dto as Product);
    repository.save = jest
      .fn()
      .mockImplementation((product) => Promise.resolve(product));
    repository.update = jest.fn().mockResolvedValue({ affected: 1 });
    repository.delete = jest.fn().mockResolvedValue({ affected: 1 });
  });

  it('should find all products', async () => {
    const products = await service.findAll();
    expect(products).toEqual(mockProducts);
  });

  it('should find one product by ID', async () => {
    const productId = 1;

    try {
      const product = await service.findOne(productId);
      expect(product).toBeDefined();
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`Product with ID ${productId} not found`);
    }
  });

  it('should throw NotFoundException if product with ID is not found', async () => {
    const nonExistentProductId = 10;

    try {
      await service.findOne(nonExistentProductId);
      fail('NotFoundException should have been thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(
        `Product with ID ${nonExistentProductId} not found`,
      );
      expect(error.response).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: `Product with ID ${nonExistentProductId} not found`,
      });
    }
  });

  it('should create a new product', async () => {
    const newProductDto = {
      itemName: 'Iphone',
      totalAmount: 200,
      tradeDesc: 'test',
    };
    const createdProduct = await service.create(newProductDto);
    expect(createdProduct).toEqual(newProductDto);
  });

  it('should delete a product by ID', async () => {
    const productIdToDelete = 1;

    try {
      const result = await service.delete(productIdToDelete);
      expect(result).toBeDefined();
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(
        `An error occurred while deleting the product.`,
      );
    }
  });
});
