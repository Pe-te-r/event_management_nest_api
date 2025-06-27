import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailModule } from 'src/mailer/mailer.module';
import { Event } from 'src/events/entities/event.entity';
import { EventRegistration } from 'src/event_registrations/entities/event_registration.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User,Event,EventRegistration]), MailModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
