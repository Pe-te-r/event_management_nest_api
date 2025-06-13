import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,

} from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    description: 'Valid email user is required',
    type: 'string',
    example:'alice@example.com'
  })
  @IsEmail()
  email: string;
  
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class RefreshDto{
  @ApiProperty({
    description: 'Refresh token is required for the request to be success',
    type: 'string'
  })
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
  
}

export class forgetDto{
  @ApiProperty({
    description: 'email for the password account to be reset',
    type: 'string',
    example:'phantom@gmail.com'
  })
  @IsNotEmpty()
  @IsString()
  email: string;
}