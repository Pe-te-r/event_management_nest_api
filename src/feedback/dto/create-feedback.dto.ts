import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty()
  @IsUUID()
  event_id: string;
  @ApiProperty()
  @IsUUID()
  user_id: string;
  @ApiProperty()
  @IsNumber()
  rating: string;
  @ApiProperty()
  @IsString()
  comments: string;
}
