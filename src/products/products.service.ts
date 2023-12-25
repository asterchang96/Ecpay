import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import {
  getCurrentTaipeiTimeString,
  generateCheckMacValue,
} from '../../utils/index';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ){}
  
  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    return await this.productsRepository.findOne({ where : { id } });
  }


  async create(product: Product): Promise<Product> {

    // 必填欄位
    const newProduct = await this.productsRepository.create(product);
    // itemName、tradeAmt、tradeDesc
    // 補上欄位
    Object.assign(newProduct, {
      merchantID: 'WIN' + getCurrentTaipeiTimeString('DatetimeString'),
      merchantTradeNo: '',
      paymentType: 'unpaid',
      rtnCode: 0,
      tradeNo:"",
      paymentDate: getCurrentTaipeiTimeString('Datetime'),
      tradeDate: "",
      checkMacValue:"",
      paymentTypeChargeFee:"",
    });

    return await this.productsRepository.save(newProduct);
    /*
    {
    "tradeAmt": 10000,
    "tradeDesc": "測試",
    "itemName": "iphone6",
    "merchantID": "WIN20231225164611",
    "merchantTradeNo": "",
    "paymentType": "unpaid",
    "rtnCode": 0,
    "tradeNo": "",
    "paymentDate": "2023/12/25 16:46:11",
    "tradeDate": "",
    "checkMacValue": "",
    "paymentTypeChargeFee": "",
    "id": 3
}
    */
  }
  
  getECPayForm(): string {
    const base_param = {
      MerchantID: () => {
        return `3002607`;
      },
      MerchantTradeNo: () => {
        return 'WIN' + getCurrentTaipeiTimeString('DatetimeString');
      },
      MerchantTradeDate: () => {
        return getCurrentTaipeiTimeString('Datetime');
      },
      PaymentType: () => {
        return `aio`;
      },
      TotalAmount: () => {
        return 30000;
      },
      TradeDesc: () => {
        return `促銷方案`;
      },
      ItemName: () => {
        return `Apple iphone 15`;
      },
      ReturnURL: () => {
        return process.env.ServerURL+`/result`;
      },
      ChoosePayment: () => {
        return `ALL`;
      },
      EncryptType: () => {
        return 1;
      },
    };
    const hashKey = process.env.HashKey;
    const hashIV = process.env.HashIV;

    const form = `
      <form action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" method="POST" name="payment">
      <input name="MerchantID" style="display: none;" value="${base_param.MerchantID()}" />
      <input name="MerchantTradeNo" style="display: none;" value="${base_param.MerchantTradeNo()}"/>
      MerchantTradeDate <input name="MerchantTradeDate" value="${base_param.MerchantTradeDate()}" /></br>
      <input name="PaymentType" style="display: none;" value="${base_param.PaymentType()}" />
      TotalAmount <input name="TotalAmount" value=${base_param.TotalAmount()} /></br>
      TradeDesc <input name="TradeDesc" value="${base_param.TradeDesc()}" /></br>
      ItemName <input name="ItemName" value="${base_param.ItemName()}" /></br>
      <input name="ReturnURL" style="display: none;"value="${base_param.ReturnURL()}" />
      <input name="ChoosePayment" style="display: none;" value="${base_param.ChoosePayment()}" />
      <input name="EncryptType" style="display: none;" value=${base_param.EncryptType()} />
      <input name="CheckMacValue" style="display: none;" value="${generateCheckMacValue(base_param, hashKey, hashIV)}" /></br>
      <button type="submit">Submit</button>
      </form>`;
    return form;
  }

  async getECPayResult(req): Promise<any> {
    try{
      const { RtnCode, PaymentDate } = req.body;
      if (RtnCode == 1) {
        
        //付款成功
      } else {
        //付款失敗
      }
    }catch(e){
    }
  }
}
