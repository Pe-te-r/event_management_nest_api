import { IsDate, IsNumber, IsUUID } from 'class-validator';

export class CreateEventRegistrationDto {
  @IsUUID()
  event_id: string;
  @IsUUID()
  user_id: string;
  @IsDate()
  registration_date: Date;
  @IsNumber()
  payment_amount: number;
}
