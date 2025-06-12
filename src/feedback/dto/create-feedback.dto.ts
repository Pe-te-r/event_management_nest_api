import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty()
  @IsUUID()
  event_id: string;
  @ApiProperty()
  @ApiProperty()
  @IsNumber()
  rating: number;
  @ApiProperty()
  @IsString()
  comments: string;
}
