import moment from 'moment-timezone';
import * as crypto from 'crypto';

export function getCurrentTaipeiTimeString(
  format?: 'DatetimeString' | 'Datetime',
) {
  const taipeiTime = moment(Date.now()).tz('Asia/Taipei');
  const date = taipeiTime.format('YYYY/MM/DD HH:mm:ss');

  const [year, month, day, hour, minute, second] = [
    taipeiTime.year(),
    taipeiTime.month() + 1,
    taipeiTime.date(),
    taipeiTime.hours(),
    taipeiTime.minutes(),
    taipeiTime.seconds(),
  ].map((value) => `${value}`.padStart(2, '0'));

  return format === 'DatetimeString'
    ? `${year}${month}${day}${hour}${minute}${second}`
    : format === 'Datetime'
      ? date
      : `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}


export function generateCheckMacValue(
  base_param: any,
  HashKey: string,
  HashIV: string,
  ) {

    let checkValue = `HashKey=${HashKey}&ChoosePayment=${base_param.ChoosePayment()}&EncryptType=${base_param.EncryptType()}&ItemName=${base_param.ItemName()}&MerchantID=${base_param.MerchantID()}&MerchantTradeDate=${base_param.MerchantTradeDate()}&MerchantTradeNo=${base_param.MerchantTradeNo()}&PaymentType=${base_param.PaymentType()}&ReturnURL=${base_param.ReturnURL()}&TotalAmount=${base_param.TotalAmount()}&TradeDesc=${base_param.TradeDesc()}&HashIV=${HashIV}`;

  checkValue = encodeURIComponent(checkValue).toLowerCase();
  
  checkValue = checkValue.replace(/%20/g, '+')
              .replace(/%2d/g, '-')
              .replace(/%5f/g, '_')
              .replace(/%2e/g, '.')
              .replace(/%21/g, '!')
              .replace(/%2a/g, '*')
              .replace(/%28/g, '(')
              .replace(/%29/g, ')')
              .replace(/%20/g, '+');

  const hash = crypto.createHash('sha256').update(checkValue).digest('hex');
  checkValue = hash.toUpperCase();
  return checkValue;
};