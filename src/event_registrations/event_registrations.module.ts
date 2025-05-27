import { Module } from '@nestjs/common';
import { EventRegistrationsService } from './event_registrations.service';
import { EventRegistrationsController } from './event_registrations.controller';

@Module({
  controllers: [EventRegistrationsController],
  providers: [EventRegistrationsService],
})
export class EventRegistrationsModule {}
