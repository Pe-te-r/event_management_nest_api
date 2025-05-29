import { Module } from '@nestjs/common';
import { EventRegistrationsService } from './event_registrations.service';
import { EventRegistrationsController } from './event_registrations.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRegistration } from './entities/event_registration.entity';

@Module({
  imports:[DatabaseModule,TypeOrmModule.forFeature([EventRegistration])],
  controllers: [EventRegistrationsController],
  providers: [EventRegistrationsService],
})
export class EventRegistrationsModule {}
