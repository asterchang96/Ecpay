import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { getCurrentTaipeiTimeString } from '../../utils/getCurrentTaipeiTimeString';
import { generateCheckMacValue } from '../../utils/generateCheckMacValue';
import {
  CreateProductDto,
  GetECPayResultDto,
  UpdateECPayResultDto,
} from './product.dto';

@Injectable()
export class ProductsService {
  private readonly logger: Logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(createProductDto);
    return await this.productRepository.save(newProduct);
  }

  async getECPayForm(id: number): Promise<string> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      this.logger.error(`Product with ID ${id} not found.`);
      throw new Error(`Product with ID ${id} not found.`);
    }

    const baseParam = {
      MerchantID: '3002607',
      MerchantTradeNo: 'WIN' + getCurrentTaipeiTimeString('DatetimeString'),
      MerchantTradeDate: getCurrentTaipeiTimeString('Datetime'),
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

    const updatedData = {
      merchantID: baseParam.MerchantID,
      merchantTradeNo: baseParam.MerchantTradeNo,
      checkMacValue: checkMacValue,
    };

    const updateProduct = await this.productRepository.update(id, updatedData);
    this.logger.log(updateProduct);

    const form = `
      <form action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" method="POST" name="payment">
      <input name="MerchantID" style="display: none;" value="${baseParam.MerchantID}" />
      <input name="MerchantTradeNo" style="display: none;" value="${baseParam.MerchantTradeNo}"/>
      MerchantTradeDate <input name="MerchantTradeDate" value="${baseParam.MerchantTradeDate}" /></br>
      <input name="PaymentType" style="display: none;" value="${baseParam.PaymentType}" />
      TotalAmount <input name="TotalAmount" value=${baseParam.TotalAmount} /></br>
      TradeDesc <input name="TradeDesc" value="${baseParam.TradeDesc}" /></br>
      ItemName <input name="ItemName" value="${baseParam.ItemName}" /></br>
      <input name="ReturnURL" style="display: none;"value="${baseParam.ReturnURL}" />
      <input name="ChoosePayment" style="display: none;" value="${baseParam.ChoosePayment}" />
      <input name="EncryptType" style="display: none;" value=${baseParam.EncryptType} />
      <input name="CheckMacValue" style="display: none;" value="${checkMacValue}" /></br>
      <button type="submit">Submit</button>
      </form>`;

    return form;
  }

  async getECPayResult(payload: GetECPayResultDto): Promise<any> {
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
        await this.productRepository.findByMerchantTradeNo(MerchantTradeNo);
      this.logger.log(product);

      // 交易不成功
      if (RtnCode !== 1) {
        const updatedData: UpdateECPayResultDto = {
          merchantID: MerchantID,
          merchantTradeNo: MerchantTradeNo,
          tradeNo: TradeNo,
          rtnCode: RtnCode,
        };
        const updateProduct = await this.productRepository.update(
          product.id,
          updatedData,
        );
        this.logger.log(updateProduct);
        return { success: false, error: 'RtnCode is not 1.' };
      }

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
        const updateProduct = await this.productRepository.update(
          product.id,
          updatedData,
        );
        return updateProduct;
      }
    } catch (e) {
      this.logger.error(e);
      return { error: 'An error occurred.' };
    }
  }

  // delete
  async delete(id: number): Promise<any> {
    try {
      const result = await this.productRepository.delete(id);
      this.logger.log(
        `Product with ID ${id} deleted successfully, result: ${result}.`,
      );
      return { message: `Product with ID ${id} deleted successfully.` };
    } catch (e) {
      this.logger.error(e);
      return { error: 'An error occurred while deleting the product.' };
    }
  }
}
