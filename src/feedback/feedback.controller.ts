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
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { RoleEnum } from 'src/common/types/enums';

@Controller('feedbacks')
@ApiTags('Feedback')
@UseGuards(RolesGuard)
@ApiBearerAuth('JWT-auth')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @Roles(RoleEnum.USER)
  @ApiOperation({ summary:'create feedback (done by user)'})
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }
  
  @Get()
  @ApiOperation({ summary: 'get all feedbacks ' })
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.ORGANIZER)
  @ApiQuery({type:'boolean',name:'detailed',required:false})
  findAll(@Query('detailed') detailed:string) {
    return this.feedbackService.findAll(detailed==='true');
  }
  
  @Get(':id')
  @Roles(RoleEnum.USER,RoleEnum.ADMIN,RoleEnum.ORGANIZER)
  @ApiOperation({ summary: 'get feedbacks by id (done by user,admin && ogranizer)' })
  @ApiQuery({type:'boolean',name:'detailed',required:false})
  findOne(@Param('id') id: string,@Query('detailed') detailed:string) {
    return this.feedbackService.findOne(id,detailed==='true');
  }
  
  @Patch(':id')
  @Roles(RoleEnum.USER)
  @ApiOperation({ summary: 'update feedbacks by id (done by user)' })
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }
  
  @Delete(':id')
  @Roles(RoleEnum.USER,RoleEnum.ADMIN,RoleEnum.ORGANIZER)
  @ApiOperation({ summary: 'delete feedbacks by id (done by user,admin && ogranizer)' })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
