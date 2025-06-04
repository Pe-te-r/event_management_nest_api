import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,

} from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    description: 'Valid email user is required',
    type: 'string',
    example:'user@gmail.com'
  })
  @IsEmail()
  email: string;
  
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
