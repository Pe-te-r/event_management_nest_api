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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('events')
@ApiBearerAuth('JWT-auth')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({summary:'create event'})
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'get all events' })
  @ApiQuery({name:'detailed',required:false,description:'get more details on events',type:'boolean',default:false})
  findAll(@Query('detailed') detailed?: string) {
    return this.eventsService.findAll(detailed==='true');
  }
  
  @Get(':id')
  @ApiOperation({summary:'get event by id'})
  @ApiQuery({name:'detailed',required:false,type:'boolean',description:'get more details on event',default:false})
  findOne(@Param('id') id: string, @Query('detailed') detailed?: string) {
    return this.eventsService.findOne(id,detailed==='true');
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
