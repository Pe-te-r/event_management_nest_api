import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, forgetDto, updatePasswordDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/common/types/enums';
import { MailService } from 'src/mailer/mailer.service';
import { randomBytes } from 'crypto';


@Injectable()
  
  
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailServer: MailService,
  ) { }
  private async getTokens(
    userId: string,
    email: string,
    role: RoleEnum = RoleEnum.USER,
  ) {
    const payload = { sub: userId, email, role };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
  
  generateSecurePassword(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(length);
  let password = '';

  for (let i = 0; i < length; i++) {
    password += chars[bytes[i] % chars.length];
  }

  return password;
  }

  private async getUserOrFail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
      select: ['id', 'email', 'password','first_name','hashed_token','role','new_password']
    })
    if (!user) {
      throw new UnauthorizedException(`user details does not match`)
    }
    return user
  }

  private async getUserbyId(id: string) {
    const user = await this.userRepository.findOne({
      where:{id:id}
    })
    if (!user) {
      throw new NotFoundException('user id not found')
    }
    return user
  }
  private async hashData(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  private async comparePasswords(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
  async login(data:CreateAuthDto) {
    const user = await this.getUserOrFail(data.email)
    if (!(await this.comparePasswords(data.password,user.password))) {
      throw new UnauthorizedException(`user details does not match`)
    }
    const { accessToken, refreshToken } = await this.getTokens(user.id, user.email,user.role);
    const hashed_token =await this.hashData(refreshToken)
    await this.userRepository.update(user.id,{hashed_token})
    return { user:{id:user.id,role:user.role,email:user.email,name:`${user.first_name}`}, accessToken, refreshToken: refreshToken };
  }

  async logout(id: string) {
    const user = await this.getUserbyId(id);
    user.hashed_token = '';
    await this.userRepository.save(user);
    return {
      status: 'success',
      message:`no longer logged to the system ${user.first_name}`
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const user = await this.getUserbyId(payload.sub);

      if (!user || !user.hashed_token) {
        throw new UnauthorizedException('Access Denied');
      }

      const tokenMatches = await this.comparePasswords(refreshToken, user.hashed_token);
      if (!tokenMatches) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.getTokens(user.id, user.email,user.role);
      const newHashedToken = await this.hashData(tokens.refreshToken);

      await this.userRepository.update(user.id, {
        hashed_token: newHashedToken,
      });

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (err) {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }
  
  async refreshAccessTokenOnly(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const user = await this.getUserbyId(payload.sub);

      if (!user || !user.hashed_token) {
        throw new UnauthorizedException('Access Denied');
      }

      const tokenMatches = await this.comparePasswords(refreshToken, user.hashed_token);
      if (!tokenMatches) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = await this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          role:user.role
        },
        {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        }
      );

      return {
        accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }
  
  async send_forget_email(forgetData:forgetDto) {
    const user = await this.getUserOrFail(forgetData.email);
    if (!user) {
      throw new NotFoundException(`user with email ${forgetData.email} not found`);
    }
  

    const tempPassword = this.generateSecurePassword();
    const hashed = await bcrypt.hash(tempPassword, 10);
    
    // Save the updated user new password
    user.new_password = hashed;
    await this.userRepository.save(user);
    console.log('one')
    await this.mailServer.sendForgotPassword(user.email, tempPassword, user.first_name);
    console.log('two')
    return {
      status: 'success',
      message:'Email sent for more info.'
    }
  }
  async update_password(updateData:updatePasswordDto) {
    const user = await this.getUserOrFail(updateData.emaiL);
    const isTempPasswordValid = await bcrypt.compare(updateData.temporaryPassword, user.new_password)
    if (!isTempPasswordValid) {
      throw new BadRequestException("Temporary password is incorrect.");
    }
    const hashed = await bcrypt.hash(updateData.newpassword, 10);

    user.password = hashed
    await this.userRepository.save(user);
    await this.mailServer.updatePassword(user.email, user.first_name);

    return {
      status: 'success',
      message: 'Password update success'
    }
    

  }
}
