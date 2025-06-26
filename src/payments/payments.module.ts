import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
import { EventRegistration } from 'src/event_registrations/entities/event_registration.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Payment, User, EventRegistration,Event])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
