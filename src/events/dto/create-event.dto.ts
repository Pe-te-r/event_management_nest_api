import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString, IsUUID } from 'class-validator';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  event_name: string;
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  event_date:Date;
  @ApiProperty()
  @IsString()
  event_location: string;
  @ApiProperty()
  @IsString()
  event_description: string;
  @ApiProperty()
  @IsUUID()
  createdById: string;
}
