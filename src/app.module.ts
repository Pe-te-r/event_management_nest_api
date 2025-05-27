import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { EventRegistrationsModule } from './event_registrations/event_registrations.module';
import { FeedbackModule } from './feedback/feedback.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    UsersModule,
    EventsModule,
    EventRegistrationsModule,
    FeedbackModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
