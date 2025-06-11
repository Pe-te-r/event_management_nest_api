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
import { EventRegistrationsService } from './event_registrations.service';
import { CreateEventRegistrationDto } from './dto/create-event_registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event_registration.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { RoleEnum } from 'src/common/types/enums';

@Controller('event_registrations')
@ApiTags('Registration')  
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
export class EventRegistrationsController {
  constructor(
    private readonly eventRegistrationsService: EventRegistrationsService,
  ) {}

  @Post()
  @Roles(RoleEnum.USER)
  @ApiOperation({summary:'create registration event (done by user)'})
  create(@Body() createEventRegistrationDto: CreateEventRegistrationDto) {
    return this.eventRegistrationsService.create(createEventRegistrationDto);
  }

  @Get()
  @Roles(RoleEnum.USER,RoleEnum.ADMIN,RoleEnum.ORGANIZER)
  @ApiOperation({ summary: 'get all registration events (done by user,admin && organizer)' })
  @ApiQuery({ name:'detailed',required:false,type:'boolean',description:'toggle for more details'})    
  findAll(@Query('detailed') detailed:string) {
    return this.eventRegistrationsService.findAll(detailed==='true');
  }
  
  @Get(':id')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.ORGANIZER)
  @ApiOperation({ summary:'get registration event by id (done by user,admin && organizer)'})
  @ApiQuery({ name:'detailed',required:false,type:'boolean',default:false,description:'toggle for more details'})    
  findOne(@Param('id') id: string,@Query('detailed') detailed:string) {
    return this.eventRegistrationsService.findOne(id,detailed==='true');
  }
  
  @Patch(':id')
  @Roles(RoleEnum.USER, RoleEnum.ORGANIZER)
  @ApiOperation({ summary:'update registration event by id (done by user && organizer)'})
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
  @Roles(RoleEnum.USER, RoleEnum.ORGANIZER)
  @ApiOperation({summary:'delete registration event by id (done by user && organizer)'})
  remove(@Param('id') id: string) {
    return this.eventRegistrationsService.remove(id);
  }
}
