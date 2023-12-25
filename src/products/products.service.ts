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
    // itemName、totalAmount、tradeDesc
    // 補上欄位
    Object.assign(newProduct, {
      merchantID: '',
      tradeAmt:0,
      merchantTradeNo: 'WIN' + getCurrentTaipeiTimeString('DatetimeString'),
      paymentType: 'unpaid',
      rtnCode: 0,
      tradeNo:"",
      MerchantTradeDate: "",
      paymentDate: "",
      tradeDate: "",
      checkMacValue:"",
      paymentTypeChargeFee:"",
    });

    return await this.productsRepository.save(newProduct);
    /*
    {
        "tradeDesc": "測試",
        "itemName": "iphone6",
        "totalAmount": 10000,
        "merchantID": "",
        "tradeAmt": 0,
        "merchantTradeNo": "WIN20231225171435",
        "paymentType": "unpaid",
        "rtnCode": 0,
        "tradeNo": "",
        "MerchantTradeDate": "",
        "paymentDate": "",
        "tradeDate": "",
        "checkMacValue": "",
        "paymentTypeChargeFee": "",
        "id": 1
    }
    */
  }
  
  async getECPayForm(id: number): Promise<string> {
    const product = await this.productsRepository.findOne({ where : { id } });
    const base_param = {
      MerchantID: () => {
        return `3002607`;
      },
      MerchantTradeNo: () => {
        return product.merchantTradeNo;
      },
      MerchantTradeDate: () => {
        return getCurrentTaipeiTimeString('Datetime');
      },
      PaymentType: () => {
        return `aio`;
      },
      TotalAmount: () => {
        return product.totalAmount;
      },
      TradeDesc: () => {
        return product.tradeDesc;
      },
      ItemName: () => {
        return product.itemName;
      },
      ReturnURL: () => {
        return process.env.ServerURL+`/products/order/result`;
      },
      ChoosePayment: () => {
        return `ALL`;
      },
      EncryptType: () => {
        return 1;
      },
    };
    console.log(base_param);
    const hashKey = process.env.HashKey;
    const hashIV = process.env.HashIV;

    const updatedData = {
      merchantID: base_param.MerchantID,
      checkMacValue: generateCheckMacValue(base_param, hashKey, hashIV),
    };

    const updateProduct = await this.productsRepository.update(id, updatedData);

    console.log(updateProduct);

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

  async getECPayResult(body): Promise<any> {
    /*{
  CustomField1: '',
  CustomField2: '',
  CustomField3: '',
  CustomField4: '',
  MerchantID: '3002607',
  MerchantTradeNo: 'WIN20231225175735',
  PaymentDate: '2023/12/25 18:01:27',
  PaymentType: 'Credit_CreditCard',
  PaymentTypeChargeFee: '735',
  RtnCode: '1',
  RtnMsg: '交易成功',
  SimulatePaid: '0',
  StoreID: '',
  TradeAmt: '30000',
  TradeDate: '2023/12/25 18:00:58',
  TradeNo: '2312251800588618',
  CheckMacValue: '05486B34B9A60ECB8F73951DD444DB35D576DAD82973C15BCC0CE7DBE8D7C255'
} */
    try{
      console.log(body);
      const { RtnCode, PaymentDate, MerchantID, PaymentType, TradeAmt, TradeNo, TradeDate, PaymentTypeChargeFee, MerchantTradeNo } = body;
      if (RtnCode == '1') {
        //付款成功
        // 判斷 macValue 是否一樣
        const product = await this.productsRepository.findOne({ where: { merchantTradeNo:MerchantTradeNo } });
        const updatedData = {
          merchantID: MerchantID,
          rtnCode: parseInt(RtnCode),
          paymentDate: PaymentDate,
          paymentType: PaymentType,
          tradeAmt: parseInt(TradeAmt),
          tradeNo: TradeNo,
          tradeDate: TradeDate,
          paymentTypeChargeFee: PaymentTypeChargeFee,
        };
        const updateProduct = await this.productsRepository.update(product.id, updatedData);
        return updateProduct;
      } else {
        //付款失敗
        return { error: 'Payment failed.' };
      }
    }catch(e){
      console.error(e);
      return { error: 'An error occurred.' };
    }
  }

   // delete
  async delete(id: number): Promise<any> {
    try{
      const result = await this.productsRepository.delete(id);
      return result;
    }catch(e){
      console.error(e);
      return { error: 'An error occurred.' };
    }

  }
}
