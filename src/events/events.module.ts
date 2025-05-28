import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Event]) ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
