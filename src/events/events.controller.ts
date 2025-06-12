import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { RoleEnum } from 'src/common/types/enums';
import { Public } from 'src/auth/decorator/public.decorator';
import { UserD } from 'src/auth/decorator/user.decorator';

@Controller('events')
@UseGuards(RolesGuard)
@ApiTags('Events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  
  @Post()
  @ApiBearerAuth('JWT-auth')
  @Roles(RoleEnum.ORGANIZER,RoleEnum.ADMIN)
  @ApiOperation({ summary:'create event (done by admin && organizer only)'})
  create(@Body() createEventDto: CreateEventDto, @UserD('sub') createdById: string) {
    console.log('Event created by id', createdById);
    return this.eventsService.create(createEventDto, createdById);
  }
  
  @Public()
  @Get()
  @ApiQuery({name:'detailed',required:false,description:'get more details on events',type:'boolean',default:false})
  findAll(@Query('detailed') detailed?: string) {
    return this.eventsService.findAll(detailed==='true');
  }
  
  @Public()
  @Get(':id')
  @ApiOperation({summary:'get event by id'})
  @ApiQuery({name:'detailed',required:false,type:'boolean',description:'get more details on event',default:false})
  findOne(@Param('id') id: string, @Query('detailed') detailed?: string) {
    return this.eventsService.findOne(id,detailed==='true');
  }
  
  @Patch(':id')
  @Roles(RoleEnum.ORGANIZER, RoleEnum.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary:'update event by id (done by admin && organizer only)'})
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }
  
  @Delete(':id')
  @Roles(RoleEnum.ORGANIZER, RoleEnum.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary:'delete event by id (done by admin && organizer only)'})
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
