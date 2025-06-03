import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsUUID } from 'class-validator';

export class CreateEventRegistrationDto {
  @ApiProperty()
  @IsUUID()
  event_id: string;
  @ApiProperty()
  @IsUUID()
  user_id: string;
  @ApiProperty()
  @IsDate()
  registration_date: Date;
  @ApiProperty()
  @IsNumber()
  payment_amount: number;
}
