import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({summary:'create event'})
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({summary:'get all events'})
  findAll() {
    return this.eventsService.findAll();
  }
  
  @Get(':id')
  @ApiOperation({summary:'get event by id'})
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
  
  @Patch(':id')
  @ApiOperation({summary:'update event by id'})
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }
  
  @Delete(':id')
  @ApiOperation({summary:'delete event by id'})
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
