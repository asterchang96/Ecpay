import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from './entity/product.entity';
import { getCurrentTaipeiTimeString } from '../../utils/getCurrentTaipeiTimeString';
import { generateCheckMacValue } from '../../utils/generateCheckMacValue';
import {
  CreateProductDto,
  GetECPayResultDto,
  UpdateECPayResultDto,
  ECPayBaseParamsDto,
  UpdateECPayOrderDto,
  ApiResponseDto,
} from './dto/product.dto';

@Injectable()
export class ProductsService {
  private readonly logger: Logger = new Logger(ProductsService.name);

  constructor(private readonly productsRepository: ProductsRepository) {}

  async findAll(): Promise<Product[]> {
    try {
      const products = await this.productsRepository.findAllProducts();
      return products;
    } catch (error) {
      this.logger.error('Error fetching products:', error);
      throw new Error('An error occurred while fetching products.');
    }
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productsRepository.createProduct(createProductDto);
    this.logger.log(`Product with ID ${newProduct}`);
    return newProduct;
  }

  async getECPayForm(id: number): Promise<string> {
    const product = await this.productsRepository.findProductById(id);

    if (!product) {
      this.logger.error(`Product with ID ${id} not found.`);
      throw new Error(`Product with ID ${id} not found.`);
    }

    const baseParam: ECPayBaseParamsDto = {
      MerchantID: '3002607',
      MerchantTradeNo: 'WIN' + getCurrentTaipeiTimeString('dateTimeString'),
      MerchantTradeDate: getCurrentTaipeiTimeString('dateTime'),
      PaymentType: 'aio',
      TotalAmount: product.totalAmount,
      TradeDesc: product.tradeDesc,
      ItemName: product.itemName,
      ReturnURL: `${process.env.ServerURL}/products/order/result`,
      ChoosePayment: 'ALL',
      EncryptType: 1,
    };

    this.logger.log(baseParam);

    const hashKey = process.env.HashKey;
    const hashIV = process.env.HashIV;
    const checkMacValue = generateCheckMacValue(baseParam, hashKey, hashIV);

    const updatedData: UpdateECPayOrderDto = {
      merchantID: baseParam.MerchantID,
      merchantTradeNo: baseParam.MerchantTradeNo,
      checkMacValue: checkMacValue,
    };

    const updateProduct = await this.productsRepository.updateProductById(
      id,
      updatedData,
    );
    this.logger.log(updateProduct);

    const form = `
      <form action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" method="POST" name="payment">
      商品名稱 ItemName : ${baseParam.ItemName}</br>
      金額 TotalAmount : ${baseParam.TotalAmount}</br>
      商品描述 TradeDesc : ${baseParam.TradeDesc}</br>
      交易時間 MerchantTradeDate : ${baseParam.MerchantTradeDate}</br>
      <input name="MerchantID" style="display: none;" value="${baseParam.MerchantID}" />
      <input name="MerchantTradeNo" style="display: none;" value="${baseParam.MerchantTradeNo}"/>
      <input name="MerchantTradeDate" style="display: none;" value="${baseParam.MerchantTradeDate}"/>
      <input name="PaymentType" style="display: none;" value="${baseParam.PaymentType}" />
      <input name="TotalAmount" style="display: none;" value="${baseParam.TotalAmount}" />
      <input name="TradeDesc" style="display: none;" value="${baseParam.TradeDesc}" />
      <input name="ItemName" style="display: none;" value="${baseParam.ItemName}" />
      <input name="ReturnURL" style="display: none;"value="${baseParam.ReturnURL}" />
      <input name="ChoosePayment" style="display: none;" value="${baseParam.ChoosePayment}" />
      <input name="EncryptType" style="display: none;" value=${baseParam.EncryptType} />
      <input name="CheckMacValue" style="display: none;" value="${checkMacValue}" /></br>
      <button type="submit">Submit</button>
      </form>`;

    return form;
  }

  async getECPayResult(payload: GetECPayResultDto): Promise<ApiResponseDto> {
    try {
      this.logger.log(payload);

      const {
        RtnCode,
        PaymentDate,
        MerchantID,
        PaymentType,
        TradeAmt,
        TradeNo,
        TradeDate,
        PaymentTypeChargeFee,
        MerchantTradeNo,
      } = payload;

      const product =
        await this.productsRepository.findByMerchantTradeNo(MerchantTradeNo);
      this.logger.log(product);

      // 找不到商品
      if (!product) {
        this.logger.error(
          `Product with MerchantTradeNo ${MerchantTradeNo} not found.`,
        );
        throw new Error(
          `Product with MerchantTradeNo ${MerchantTradeNo} not found.`,
        );
      } else {
        const updatedData: UpdateECPayResultDto = {
          merchantID: MerchantID,
          merchantTradeNo: MerchantTradeNo,
          rtnCode: RtnCode,
          paymentDate: PaymentDate,
          paymentType: PaymentType,
          tradeAmt: TradeAmt,
          tradeNo: TradeNo,
          tradeDate: TradeDate,
          paymentTypeChargeFee: PaymentTypeChargeFee,
        };
        const updateProduct = await this.productsRepository.updateProductById(
          product.id,
          updatedData,
        );
        this.logger.log(updateProduct);
        return { statusCode: 200, message: 'Update success.' };
      }
    } catch (e) {
      this.logger.error(e);
      return { statusCode: 500, error: 'An error occurred.' };
    }
  }

  async delete(id: number): Promise<ApiResponseDto> {
    try {
      const product = await this.productsRepository.findProductById(id);
      if (!product) {
        return {
          statusCode: 404,
          message: `ProductID ${id} is not found.`,
        };
      }
      const result = await this.productsRepository.deleteProductById(id);
      this.logger.log(
        `ProductID ${id} deleted successfully, result: ${result}.`,
      );
      return {
        statusCode: 200,
        message: `ProductID ${id} deleted successfully.`,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        statusCode: 500,
        error: 'An error occurred while deleting the product.',
      };
    }
  }

  // async updateProduct(id: number): Promise<any> {
  //   const updatedData: UpdateECPayOrderDto = {
  //     merchantID: '測試',
  //     merchantTradeNo: '測試',
  //     checkMacValue: '123',
  //   };
  //   this.logger.log(id, updatedData);
  //   const updateProduct = await this.productsRepository.updateProductById(
  //     id,
  //     updatedData,
  //   );
  //   this.logger.log(updateProduct);
  //   return updateProduct;
  // }
}
