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
  
  @ApiProperty()
  @IsString()
  first_name: string;
  
  @ApiProperty({required:false})
  @IsString()
  @IsOptional()
  last_name: string;
  
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  
  @ApiProperty({required:false})
  @IsOptional()
  @IsNumberString()
  phone: string;
}
