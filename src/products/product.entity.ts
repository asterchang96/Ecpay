import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  merchantID: String;

  @Column()
  merchantTradeNo: String;

  @Column()
  paymentDate: String;

  @Column()
  paymentType: String; // default :unpaid -> Credit_CreditCard

  @Column()
  rtnCode: number; //交易是否成功(1 成功) > RtnMsg: '交易成功'

  @Column()
  tradeAmt: number; // 交易金額

  @Column()
  tradeNo: string;

  @Column()
  tradeDate: string;

  @Column()
  checkMacValue: string;

  @Column()
  paymentTypeChargeFee: string;

  @Column()
  tradeDesc: string;

  @Column()
  itemName: string;

  @Column()
  totalAmount: number;
}
