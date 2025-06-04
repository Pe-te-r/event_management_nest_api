import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/events/entities/event.entity';

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([Feedback,User,Event])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
