import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/responseType';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback) private feedbackRepository:Repository<Feedback>
  ){}
  create(createFeedbackDto: CreateFeedbackDto) {
    return 'This action adds a new feedback';
  }

  async findAll(detailed:boolean=false) {
    if (detailed) {
          const all_registrations = await this.feedbackRepository.find({
            relations: {
              owner: true,
              event:true,
            }
          })
      if (all_registrations.length == 0) {
        throw new NotFoundException('no feedback found');
      }
      
      return {
        status: 'success',
        message: 'feedback details found',
        data: all_registrations
        }
    }
        const all_registrations = await this.feedbackRepository.find()
        if (all_registrations.length == 0) {
          throw new NotFoundException('no feedback found');
        }
        return {
          status: 'success',
          message: 'feedback details found',
          data: all_registrations      
        }
  }

  async findOne(id: string, detailed: boolean = false): Promise<ApiResponse<Feedback | null>> {
    if (detailed) {
      const feedbackFound = await this.feedbackRepository.findOne({
        where: { feedback_id: id },
        relations: {
          owner: true,
          event: true,
        }
      })
      if (!feedbackFound) {
        throw new NotFoundException(`comment id ${id} not found`)
      }
      return {
        status: 'success',
        message: 'feedback details found',
        data: feedbackFound
      }
    }
    const feedbackFound = await this.feedbackRepository.findOne({
      where: { feedback_id: id }
    })
    if (!feedbackFound) {
      throw new NotFoundException(`comment id ${id} not found`)
    }
    return {
      status: 'success',
      message: 'feedback details found',
      data: feedbackFound
    }
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    return `This action updates a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
