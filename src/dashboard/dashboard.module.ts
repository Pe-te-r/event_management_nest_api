import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { User } from 'src/users/entities/user.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import { EventRegistration } from 'src/event_registrations/entities/event_registration.entity';
import { Event } from 'src/events/entities/event.entity';

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([Event,User,Feedback,EventRegistration]) ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
