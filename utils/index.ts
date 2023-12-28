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
  baseParam: any,
  hashKey: string,
  hashIV: string,
): string {
  const checkValue = `HashKey=${hashKey}&ChoosePayment=${baseParam.ChoosePayment}&EncryptType=${baseParam.EncryptType}&ItemName=${baseParam.ItemName}&MerchantID=${baseParam.MerchantID}&MerchantTradeDate=${baseParam.MerchantTradeDate}&MerchantTradeNo=${baseParam.MerchantTradeNo}&PaymentType=${baseParam.PaymentType}&ReturnURL=${baseParam.ReturnURL}&TotalAmount=${baseParam.TotalAmount}&TradeDesc=${baseParam.TradeDesc}&HashIV=${hashIV}`;

  const encodedValue = encodeURIComponent(checkValue).toLowerCase();

  const normalizedValue = encodedValue.replace(/%20/g, '+')
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%20/g, '+');

  const hash = crypto.createHash('sha256').update(normalizedValue).digest('hex');
  return hash.toUpperCase();
}

