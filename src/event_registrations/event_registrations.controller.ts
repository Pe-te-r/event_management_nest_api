import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EventRegistrationsService } from './event_registrations.service';
import { CreateEventRegistrationDto } from './dto/create-event_registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event_registration.dto';

@Controller('event_registrations')
export class EventRegistrationsController {
  constructor(
    private readonly eventRegistrationsService: EventRegistrationsService,
  ) {}

  @Post()
  create(@Body() createEventRegistrationDto: CreateEventRegistrationDto) {
    return this.eventRegistrationsService.create(createEventRegistrationDto);
  }

  @Get()
  findAll(@Query('detailed') detailed:boolean) {
    return this.eventRegistrationsService.findAll(detailed);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventRegistrationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventRegistrationDto: UpdateEventRegistrationDto,
  ) {
    return this.eventRegistrationsService.update(
      +id,
      updateEventRegistrationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventRegistrationsService.remove(+id);
  }
}
