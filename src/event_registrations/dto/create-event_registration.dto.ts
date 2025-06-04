import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsUUID } from 'class-validator';

export class CreateEventRegistrationDto {
  @ApiProperty()
  @IsUUID()
  event_id: string;
  @ApiProperty()
  @IsUUID()
  user_id: string;
  @ApiProperty({example:'2029-09-02'})
  @IsDate()
  registration_date: Date;
  @ApiProperty({example:3000})
  @IsNumber()
  payment_amount: number;
}
