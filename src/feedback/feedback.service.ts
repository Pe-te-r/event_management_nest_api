import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';

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

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    return `This action updates a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
