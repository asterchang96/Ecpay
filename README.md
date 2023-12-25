<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API 測試
1. 建立商品
```
POST 127.0.0.1:3000/products
{
    "itemName": "iphone9",
    "totalAmount": 30000,
    "tradeDesc": "測試"
}
```
預計回傳
```
{
    "tradeDesc": "測試",
    "itemName": "iphone9",
    "totalAmount": 30000,
    "merchantID": "",
    "tradeAmt": 0,
    "merchantTradeNo": "WIN20231225181937",
    "paymentType": "unpaid",
    "rtnCode": 0,
    "tradeNo": "",
    "MerchantTradeDate": "",
    "paymentDate": "",
    "tradeDate": "",
    "checkMacValue": "",
    "paymentTypeChargeFee": "",
    "id": 10
}
```

2. 建立綠界訂單 - 需透過前端網頁導轉(Submit)到綠界付款API網址。且必須為https URL
```
信用卡 4311-9522-2222-2222
csv 222
```

交易成功後，綠界會回打API，系統更新資料庫資料。

3.查詢全部資料
```
GET 127.0.0.1:3000/products
```

```
[
    {
        "id": 1,
        "merchantID": "3002607",
        "merchantTradeNo": "WIN20231225171435",
        "paymentDate": "",
        "paymentType": "unpaid",
        "rtnCode": 0,
        "tradeAmt": 0,
        "tradeNo": "",
        "tradeDate": "",
        "checkMacValue": "944C6FF001BEBCB8EB830B994E443C0FA5F64282D82F5F1D4799AF1B0D233E24",
        "paymentTypeChargeFee": "",
        "tradeDesc": "測試",
        "itemName": "iphone6",
        "totalAmount": 10000
    },
    {
        "id": 9,
        "merchantID": "3002607",
        "merchantTradeNo": "WIN20231225181521",
        "paymentDate": "2023/12/25 18:16:37",
        "paymentType": "Credit_CreditCard",
        "rtnCode": 1,
        "tradeAmt": 30000,
        "tradeNo": "2312251815368641",
        "tradeDate": "2023/12/25 18:15:36",
        "checkMacValue": "D6EA87E47DFCB150E5C45B6F5B9C55A2E136388C033EE4D6F046A34013E2F0BD",
        "paymentTypeChargeFee": "735",
        "tradeDesc": "測試",
        "itemName": "iphone9",
        "totalAmount": 30000
    },
    {
        "id": 10,
        "merchantID": "3002607",
        "merchantTradeNo": "WIN20231225181937",
        "paymentDate": "2023/12/25 18:20:32",
        "paymentType": "Credit_CreditCard",
        "rtnCode": 1,
        "tradeAmt": 30000,
        "tradeNo": "2312251819518648",
        "tradeDate": "2023/12/25 18:19:51",
        "checkMacValue": "1DC5922A99E446E34CB349E07B513DA2080390A4CCB75FD15D0504442B7DCE33",
        "paymentTypeChargeFee": "735",
        "tradeDesc": "測試",
        "itemName": "iphone9",
        "totalAmount": 30000
    }
]
```

3.查詢單筆資料
```
GET 127.0.0.1:3000/products/:id
```
```
{
    "id": 10,
    "merchantID": "3002607",
    "merchantTradeNo": "WIN20231225181937",
    "paymentDate": "2023/12/25 18:20:32",
    "paymentType": "Credit_CreditCard",
    "rtnCode": 1,
    "tradeAmt": 30000,
    "tradeNo": "2312251819518648",
    "tradeDate": "2023/12/25 18:19:51",
    "checkMacValue": "1DC5922A99E446E34CB349E07B513DA2080390A4CCB75FD15D0504442B7DCE33",
    "paymentTypeChargeFee": "735",
    "tradeDesc": "測試",
    "itemName": "iphone9",
    "totalAmount": 30000
}
```

4.刪除某筆資料
```
DELETE 127.0.0.1:3000/products/4
```



## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
