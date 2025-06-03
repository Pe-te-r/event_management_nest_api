import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Valid email user is required',
    type: 'string',
    example:'user@gmail.com'
  })
  @IsEmail()
  email: string;
  
  @ApiProperty({
    description: "First Name ",
    type: 'string',
    example:'phantom'
  })
  @IsString()
  first_name: string;
  
  @ApiProperty({
    required: false,
    example:'Doe'
  })
  @IsString()
  @IsOptional()
  last_name: string;
  
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  
  @ApiProperty({
    required: false,
    example:'0748***233'
  })
  @IsOptional()
  @IsNumberString()
  phone: string;
}
