import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { EventRegistrationsModule } from './event_registrations/event_registrations.module';
import { FeedbackModule } from './feedback/feedback.module';
import { PaymentsModule } from './payments/payments.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { DatabaseModule } from './database/database.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guards';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EmailThrottlerGuard } from './auth/rate-limter/email-throtter';
import { RedisThrottlerStorage } from './auth/rate-limter/redis-storage';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailModule } from './mailer/mailer.module';
import { DashboardModule } from './dashboard/dashboard.module';




@Module({
  imports: [
    // register env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development'],
    }),
    // register redis
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        return {
          ttl: 60000,
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 30000, lruSize: 5000 }),
            }),
            createKeyv(configService.getOrThrow<string>('REDIS_URL')),
          ],
        };
      },
    }),
    // register rate limter
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [{
          limit: Number(config.get('THROTTLE_TTL')),
          ttl: seconds(Number(config.get('THROTTLE_LIMIT')))
        }],
        storage: new RedisThrottlerStorage(config),
      }),
    }),
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // path to index.html
      exclude: ['/api*', '/docs*'], 
    }),

    DatabaseModule,
    AuthModule,
    UsersModule,
    EventsModule,
    EventRegistrationsModule,
    FeedbackModule,
    PaymentsModule,
    MailModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    { provide: APP_GUARD, useClass: EmailThrottlerGuard },

  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
