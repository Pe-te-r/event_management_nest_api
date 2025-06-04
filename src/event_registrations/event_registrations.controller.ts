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
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('event_registrations')
export class EventRegistrationsController {
  constructor(
    private readonly eventRegistrationsService: EventRegistrationsService,
  ) {}

  @Post()
  @ApiOperation({summary:'create registration event'})
  create(@Body() createEventRegistrationDto: CreateEventRegistrationDto) {
    return this.eventRegistrationsService.create(createEventRegistrationDto);
  }

  @Get()
  @ApiOperation({ summary: 'get all registration events' })
  @ApiQuery({ name:'detailed',required:false,type:'boolean',description:'toggle for more details'})    
  findAll(@Query('detailed') detailed:string) {
    return this.eventRegistrationsService.findAll(detailed==='true');
  }
  
  @Get(':id')
  @ApiOperation({summary:'get registration event by id'})
  @ApiQuery({ name:'detailed',required:false,type:'boolean',default:false,description:'toggle for more details'})    
  findOne(@Param('id') id: string,@Query('detailed') detailed:string) {
    return this.eventRegistrationsService.findOne(id,detailed==='true');
  }
  
  @Patch(':id')
  @ApiOperation({summary:'update registration event by id'})
  update(
    @Param('id') id: string,
    @Body() updateEventRegistrationDto: UpdateEventRegistrationDto,
  ) {
    return this.eventRegistrationsService.update(
      id,
      updateEventRegistrationDto,
    );
  }
  
  @Delete(':id')
  @ApiOperation({summary:'delete registration event by id'})
  remove(@Param('id') id: string) {
    return this.eventRegistrationsService.remove(id);
  }
}
