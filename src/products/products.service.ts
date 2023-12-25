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
        return 1000;
      },
      TradeDesc: () => {
        return product.tradeDesc;
      },
      ItemName: () => {
        return product.itemName;
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

    const updatedData = {
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

   // delete
  async delete(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
