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
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({summary:'create feedback'})
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }
  
  @Get()
  @ApiOperation({ summary: 'get all feedbacks' })
  @ApiQuery({type:'boolean',name:'detailed',required:false})
  findAll(@Query('detailed') detailed:string) {
    return this.feedbackService.findAll(detailed==='true');
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'get feedbacks by id' })
  @ApiQuery({type:'boolean',name:'detailed',required:false})
  findOne(@Param('id') id: string,@Query('detailed') detailed:string) {
    return this.feedbackService.findOne(id,detailed==='true');
  }
  
  @Patch(':id')
  @ApiOperation({ summary: 'update feedbacks by id' })
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }
  
  @Delete(':id')
  @ApiOperation({ summary: 'delete feedbacks by id' })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
