import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateFeedbackDto {
  @IsUUID()
  event_id: string;
  @IsUUID()
  user_id: string;
  @IsNumber()
  rating: string;
  @IsString()
  comments: string;
}
