import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber()
  payment: number;
  @ApiProperty()
  @IsString()
  payment_method: string;
  @ApiProperty()
  @IsUUID()
  registration_id: string;
}
