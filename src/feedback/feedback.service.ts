import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/responseType';
import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/events/entities/event.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback) private feedbackRepository:Repository<Feedback>,
    @InjectRepository(User) private userRepository:Repository<User>,
    @InjectRepository(Event) private eventRepository:Repository<Event>,
  ){}
  async create(createFeedbackDto: CreateFeedbackDto): Promise<ApiResponse<Feedback>> {
    const { event_id, user_id, rating, comments } = createFeedbackDto;
    const event = await this.eventRepository.findOne({where:{event_id:event_id}})
    const user =await this.userRepository.findOne({ where: { id: user_id } })
    
    if (!user || !event) {
      throw new NotFoundException(`Event id or User id does not exits`)
    }

    const feedback = this.feedbackRepository.create({
      rating: Number(rating),
      comments,
      event: event,
      owner: user,
    });

    const saved = await this.feedbackRepository.save(feedback);

    return {
      status: 'success',
      message: 'Feedback created successfully',
      data: saved,
    };
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

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<ApiResponse<Feedback>> {
    const feedback = await this.feedbackRepository.findOne({ where: { feedback_id: id } });

    if (!feedback) {
      throw new NotFoundException(`Feedback with id ${id} not found`);
    }

    Object.assign(feedback, updateFeedbackDto);

    const updated = await this.feedbackRepository.save(feedback);

    return {
      status: 'success',
      message: 'Feedback updated successfully',
      data: updated,
    };
  }
  

  async remove(id: string): Promise<ApiResponse<null>> {
    const feedback = await this.feedbackRepository.findOne({ where: { feedback_id: id } });

    if (!feedback) {
      throw new NotFoundException(`Feedback with id ${id} not found`);
    }

    await this.feedbackRepository.remove(feedback);

    return {
      status: 'success',
      message: 'Feedback removed successfully',
      data: null,
    };
  }
  
}
