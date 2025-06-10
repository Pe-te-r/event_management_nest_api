import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/middlewares/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet())
  const config = new DocumentBuilder()
    .setTitle('Event Notification Api')
    .setDescription(`
      # Event Notification API
      Endpoints for managing event notifications.
      
      ## Features
      - **Event CRUD**: Create, list, update events 
      - **Subscriptions**: Users can subscribe to events
      - **Notifications**: Email/SMS alerts
      
      ## Authentication
      - Requires \`\`Authorization: Bearer <token>\`\`
      - Roles: Admin, Organizer, User
      `)
      
    .setVersion('1.0')
    .addTag('Auth','Authentications endpoints managements')
    .addTag('Feedback','Feedback endpoints managements')
    .addTag('Users','Users endpoints managements')
    .addTag('Events','Events endpoints managements')
    .addTag('Payments','Payments endpoints managements')
    .addTag('Registration','Event Registration endpoints managements')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    }, 'JWT-auth')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      docExpansion:'none',
      requestInterceptor: (req) => {
        if (req.headers?.Authorization) {
          req.headers.Authorization = `${req.headers.Authorization}`;
        }
        return req;
      },

    }
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
