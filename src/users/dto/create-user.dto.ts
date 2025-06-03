import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  
  @IsString()
  first_name: string;
  
  @IsString()
  @IsOptional()
  last_name: string;
  
  @IsNotEmpty()
  password: string;
  
  @IsOptional()
  @IsNumberString()
  phone: string;
}
