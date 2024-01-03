import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsPositive,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  // product name (required) 1-50
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly itemName: string;

  // product price (required)
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly totalAmount: number;

  // product description (opt.) null-200
  @IsNotEmpty()
  @MaxLength(200)
  readonly tradeDesc: string;
}

// 傳至 checkMacValue
export class ECPayBaseParamsDto {
  readonly MerchantID: string;
  readonly MerchantTradeNo: string;
  readonly MerchantTradeDate: string;
  readonly PaymentType: string;
  readonly TotalAmount: number;
  readonly TradeDesc: string;
  readonly ItemName: string;
  readonly ReturnURL: string;
  readonly ChoosePayment: string;
  readonly EncryptType: number;
}

// 更新產生訂單資料
export class UpdateECPayOrderDto {
  merchantID: string;
  merchantTradeNo: string;
  checkMacValue: string;
}

// 取得 ecpay 回傳資料
export class GetECPayResultDto {
  readonly MerchantID: string;
  readonly MerchantTradeNo: string;
  readonly TradeNo: string;
  readonly RtnCode: number;
  readonly TradeAmt: string;
  readonly PaymentDate: string;
  readonly PaymentType: string;
  readonly TradeDate: string;
  readonly CheckMacValue: string;
  StoreID: string;
  RtnMsg: string;
  PaymentTypeChargeFee: number;
  SimulatePaid: number;
  CustomField1: string;
  CustomField2: string;
  CustomField3: string;
  CustomField4: string;
}

// 更新回 Product
export class UpdateECPayResultDto {
  merchantID: string;
  merchantTradeNo: string;
  tradeNo: string;
  rtnCode: number;
  storeID?: string;
  rtnMsg?: string;
  tradeAmt?: string;
  paymentDate?: string;
  paymentType?: string;
  paymentTypeChargeFee?: number;
  tradeDate?: string;
  simulatePaid?: number;
  customField1?: string;
  customField2?: string;
  customField3?: string;
  customField4?: string;
  checkMacValue?: string;
}
