import { Test } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { Product } from './entity/product.entity';
import { NotFoundException } from '@nestjs/common';
import { ApiResponseDto, CreateProductDto } from './dto/product.dto';

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

jest.mock('./products.repository', () => ({
  ProductsRepository: jest.fn(() => ({
    findAll: jest.fn(() => mockProducts),
  })),
}));

describe('ProductsController', () => {
  let productsController;
  let productsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService, ProductsRepository],
    }).compile();

    productsService = moduleRef.get<ProductsService>(ProductsService);
    productsController = moduleRef.get<ProductsController>(ProductsController);
  });

  describe('findAll', () => {
    it('should return an array of Products', async () => {
      jest.spyOn(productsService, 'findAll').mockReturnValueOnce(mockProducts);

      const result = await productsController.findAll();
      expect(result).toEqual(mockProducts);
    });

    it('should return an empty array', async () => {
      jest.spyOn(productsService, 'findAll').mockReturnValueOnce([]);

      const result = await productsController.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a Product', async () => {
      const mockProduct = mockProducts[0];
      jest.spyOn(productsService, 'findOne').mockResolvedValueOnce(mockProduct);

      const result = await productsController.findOne(1);
      expect(result).toEqual(mockProduct);
    });

    it('should handle Product not found', async () => {
      jest.spyOn(productsService, 'findOne').mockResolvedValueOnce(null);

      try {
        await productsController.findOne(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Product with ID 1 not found');
      }
    });
  });

  describe('delete', () => {
    it('should delete a product.', async () => {
      const productId = 1;
      const mockApiResponseDto: ApiResponseDto = {
        statusCode: 200,
        message: 'ProductID ${id} deleted successfully.',
      };

      jest
        .spyOn(productsService, 'delete')
        .mockResolvedValueOnce(mockApiResponseDto);

      const result = await productsController.delete(productId);

      expect(result).toEqual(mockApiResponseDto);
      expect(productsService.delete).toHaveBeenCalledWith(productId);
    });

    it('should handle Product not found.', async () => {
      const productId = 4;
      const mockApiResponseDto: ApiResponseDto = {
        statusCode: 404,
        message: 'Product not found',
      };

      jest
        .spyOn(productsService, 'delete')
        .mockResolvedValueOnce(mockApiResponseDto);

      const result = await productsController.delete(productId);

      expect(result).toEqual(mockApiResponseDto);
      expect(productsService.delete).toHaveBeenCalledWith(productId);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        tradeDesc: '',
        itemName: 'iphone6',
        totalAmount: 10000,
      };

      const createdProduct: Product = {
        id: 1,
        merchantID: 'WIN123588',
        itemName: createProductDto.itemName,
        totalAmount: createProductDto.totalAmount,
        merchantTradeNo: '',
        paymentDate: '',
        paymentType: '',
        rtnCode: 0,
        tradeAmt: '',
        tradeNo: '',
        tradeDate: '',
        checkMacValue: '',
        paymentTypeChargeFee: 0,
        tradeDesc: '',
      };

      jest
        .spyOn(productsService, 'create')
        .mockResolvedValueOnce(createdProduct);

      const result = await productsController.create(createProductDto);

      expect(result).toEqual(createdProduct);
      expect(productsService.create).toHaveBeenCalledWith(createProductDto);
    });
  });
});
