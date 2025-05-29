import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
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
