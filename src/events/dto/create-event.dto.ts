import { IsDate, IsString, IsUUID } from 'class-validator';

export class CreateEventDto {
  @IsString()
  event_name: string;
  @IsDate()
  event_date: Date;
  @IsString()
  event_location: string;
  @IsString()
  event_description: string;
  @IsUUID()
  created_by: string;
}
