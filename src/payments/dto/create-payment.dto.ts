import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  payment: number;
  @IsString()
  payment_method: string;
  @IsUUID()
  registration_id: string;
}
