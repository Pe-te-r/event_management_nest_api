import { Controller, Post, Body, Param, Get, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, forgetDto, RefreshDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Public } from './decorator/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RtGuard } from './guards';
import { UserD } from './decorator/user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with email and username' })
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }
  
  @Get('signout/:id')
  @ApiBearerAuth('JWT-auth') 
  @ApiOperation({ summary: 'Log out user' })
  signout(@Param('id')id:string) {
    return this.authService.logout(id)
  }
  @UseGuards(RtGuard)
  @ApiBearerAuth('JWT-auth') 
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  refresh(@Body() {refresh_token}: RefreshDto) {
    return this.authService.refreshToken(refresh_token);
  }
  
  @Post('refresh/access')
  @ApiBearerAuth('JWT-auth') 
  @ApiOperation({ summary: 'Get new access token using refresh token (no rotation)' })
  refreshAccessTokenOnly(@Body() {refresh_token}: RefreshDto) {
    return this.authService.refreshAccessTokenOnly(refresh_token);
  }
  
  @Public()
  @Post('forget-password')
  @ApiOperation({ summary: 'Will receive an email for further instructions on password reset' })
  fogertPassword(@Body() forgetData: forgetDto) {
    
    return this.authService.send_forget_email(forgetData)
  }

}
