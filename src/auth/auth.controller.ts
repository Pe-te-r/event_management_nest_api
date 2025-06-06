import { Controller, Post, Body, Param, Get, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Public } from './decorator/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RtGuard } from './guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiBearerAuth('JWT-auth') 
  @ApiOperation({ summary: 'Login with email and username' })
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }
  
  @Public()
  @Get('signout/:id')
  @ApiOperation({ summary: 'Log out user' })
  signout(@Param('id')id:string) {
   return this.authService.logout(id)
  }
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  refresh(@Body('token') token: string) {
    return this.authService.refreshToken(token);
  }

  @Post('refresh/access')
  @ApiOperation({ summary: 'Get new access token using refresh token (no rotation)' })
  refreshAccessTokenOnly(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessTokenOnly(refreshToken);
  }

  


}
