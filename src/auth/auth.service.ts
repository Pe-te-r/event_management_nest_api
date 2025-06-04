import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }
  private async getTokens(userId: string, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
        },
        {
          secret: this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_SECRET',
          ),
          expiresIn: this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
          ),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
        },
        {
          secret: this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_SECRET',
          ),
          expiresIn: this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
          ),
        },
      ),
    ]);
    return { accessToken: at, refreshToken: rt };
  }

  private async getUserOrFail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
      select:['id','email','password']
    })
    if (!user) {
      throw new UnauthorizedException(`user details does not match`)
    }
    return user
  }
  async login(data:CreateAuthDto) {
    const user = await this.getUserOrFail(data.email)
    if (user.password !== data.password) {
      throw new UnauthorizedException(`user details does not match`)
    }
    const { accessToken, refreshToken } = await this.getTokens(user.id,user.email);
    return { accessToken, refreshToken: refreshToken };
  }
  
}
