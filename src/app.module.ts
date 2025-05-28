import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { EventRegistrationsModule } from './event_registrations/event_registrations.module';
import { FeedbackModule } from './feedback/feedback.module';
import { PaymentsModule } from './payments/payments.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    UsersModule,
    EventsModule,
    EventRegistrationsModule,
    FeedbackModule,
    PaymentsModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}
