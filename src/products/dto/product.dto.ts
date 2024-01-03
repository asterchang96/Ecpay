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
  @MaxLength(50, { message: 'itemName should not exceed 50 characters' })
  readonly itemName: string;

  // product price (required)
  @IsNotEmpty()
  @IsInt({ message: 'totalAmount must be an integer.' })
  @IsPositive()
  readonly totalAmount: number;

  // product description (opt.) null-200
  @IsNotEmpty()
  @MaxLength(200, { message: 'itemName should not exceed 200 characters' })
  readonly tradeDesc: string;
}

export interface GetECPayResultDto {
  MerchantID: string;
  MerchantTradeNo: string;
  TradeNo: string;
  StoreID: string;
  RtnCode: number;
  RtnMsg: string;
  TradeAmt: string;
  PaymentDate: string;
  PaymentType: string;
  PaymentTypeChargeFee: number;
  TradeDate: string;
  SimulatePaid: number;
  CustomField1: string;
  CustomField2: string;
  CustomField3: string;
  CustomField4: string;
  CheckMacValue: string;
}

export interface UpdateECPayResultDto {
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

// 更新產生訂單資料
export interface UpdateECPayOrderDto {
  merchantID: string;
  merchantTradeNo: string;
  checkMacValue: string;
}

export interface ECPayBaseParamsDto {
  MerchantID: string;
  MerchantTradeNo: string;
  MerchantTradeDate: string;
  PaymentType: string;
  TotalAmount: number;
  TradeDesc: string;
  ItemName: string;
  ReturnURL: string;
  ChoosePayment: string;
  EncryptType: number;
}
