import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt } from 'class-validator';


@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "" })
  merchantID: String;

  @Column({ default: "" })
  merchantTradeNo: String;

  @Column({ default: "" })
  paymentDate: String;

  @Column({ default: "unpaid" })
  paymentType: String; // default :unpaid -> Credit_CreditCard

  @Column({ default: 0 })
  @IsInt({ message: 'rtnCode must be an integer in entity.' })
  rtnCode: number; //交易是否成功(1 成功) > RtnMsg: '交易成功'

  @Column({ default: 0 })
  @IsInt({ message: 'tradeAmt must be an integer in entity.' })
  tradeAmt: number; // 交易金額

  @Column({ default: "" })
  tradeNo: string;

  @Column({ default: "" })
  tradeDate: string;

  @Column({ default: "" })
  checkMacValue: string;

  @Column({ default: "" })
  paymentTypeChargeFee: string;

  @Column({ default: "" })
  tradeDesc: string;

  @Column()
  itemName: string;

  @Column()
  totalAmount: number;
}
