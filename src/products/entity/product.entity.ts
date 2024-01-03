import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt } from 'class-validator';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  merchantID: string;

  @Column({ default: '' })
  merchantTradeNo: string;

  @Column({ default: '' })
  paymentDate: string;

  @Column({ default: 'unpaid' })
  paymentType: string; // default :unpaid -> Credit_CreditCard

  @Column({ default: 0 })
  @IsInt({ message: 'rtnCode must be an integer in entity.' })
  rtnCode: number; //交易是否成功(1 成功) > RtnMsg: '交易成功'，其餘都失敗(0:尚未交易)

  @Column({ default: '0' })
  tradeAmt: string; // 交易金額

  @Column({ default: '' })
  tradeNo: string;

  @Column({ default: '' })
  tradeDate: string;

  @Column({ default: '' })
  checkMacValue: string;

  @Column({ default: 0 })
  paymentTypeChargeFee: number;

  @Column()
  tradeDesc: string;

  @Column()
  itemName: string;

  @Column({ type: 'int' })
  totalAmount: number;
}
