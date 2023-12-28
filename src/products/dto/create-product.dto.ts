import { IsNotEmpty, IsString, IsInt, IsPositive, MaxLength } from 'class-validator';

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
  @MaxLength(200, { message: 'itemName should not exceed 200 characters' })
  readonly tradeDesc: string;

}