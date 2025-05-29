import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventRegistrationDto } from './dto/create-event_registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event_registration.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventRegistration } from './entities/event_registration.entity';
import { ApiResponse } from 'src/responseType';

@Injectable()
export class EventRegistrationsService {
  constructor(
    @InjectRepository(EventRegistration) private eventRegisterRepository: Repository<EventRegistration>
  ) { };
  create(createEventRegistrationDto: CreateEventRegistrationDto) {
    return 'This action adds a new eventRegistration';
  }

  async findAll(detailed:boolean=false): Promise<ApiResponse<EventRegistration[] | null>> {
    if (detailed) {
      const all_registrations = await this.eventRegisterRepository.find({
        relations: {
          paidUser: true,
          payments: true,
          
        }
      })
      return {
        status: 'success',
        message: 'register details found',
        data: all_registrations
      }
      
    }
    const all_registrations = await this.eventRegisterRepository.find()
    if (all_registrations.length == 0) {
      throw new NotFoundException('no registration found');
    }
    return {
      status: 'success',
      message: 'register details found',
      data: all_registrations      
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} eventRegistration`;
  }

  update(id: number, updateEventRegistrationDto: UpdateEventRegistrationDto) {
    return `This action updates a #${id} eventRegistration`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventRegistration`;
  }
}
