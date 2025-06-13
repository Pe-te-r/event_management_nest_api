import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RTStrategy } from './stategies';
import { AtGuard, RtGuard } from './guards';
import { MailModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ global: true }),
    MailModule
   ],
  controllers: [AuthController],
  providers: [AuthService,
    AtStrategy,
    AtGuard,
    RTStrategy,
    RtGuard,
  ],
  exports: [AuthService],

})
export class AuthModule { }
