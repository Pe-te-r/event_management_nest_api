import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventRegistrationDto } from './dto/create-event_registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event_registration.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventRegistration } from './entities/event_registration.entity';
import { ApiResponse } from 'src/responseType';
import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/events/entities/event.entity';

@Injectable()
export class EventRegistrationsService {
  constructor(
    @InjectRepository(EventRegistration) private eventRegisterRepository: Repository<EventRegistration>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Event) private eventRepository: Repository<Event>
  ) {};
  async create(createEventRegistrationDto: CreateEventRegistrationDto) {
    const user = await this.userRepository.findOne({ where: { id: createEventRegistrationDto.user_id } });
    if (!user) {
      throw new NotFoundException(`User with id ${createEventRegistrationDto.user_id} not found`);
    }

    const event = await this.eventRepository.findOne({ where: { event_id: createEventRegistrationDto.event_id } });
    if (!event) {
      throw new NotFoundException(`Event with id ${createEventRegistrationDto.event_id} not found`);
    }

    const newEvent = this.eventRegisterRepository.create({
      payment_amount: createEventRegistrationDto.payment_amount,
      registration_date: createEventRegistrationDto.registration_date,
      paidUser: user,
      registeredEvent: event
    });

    const savedEvent = await this.eventRegisterRepository.save(newEvent);

    return {
      status: 'success',
      message: `Event registration done successfully with id ${savedEvent.registration_id}`
    };
  }
  

  async findAll(detailed:boolean=false): Promise<ApiResponse<EventRegistration[] | null>> {
    if (detailed) {
      const all_registrations = await this.eventRegisterRepository.find({
        relations: {
          paidUser: true,
          registeredEvent: true,
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

  async findOne(id: string, detailed: boolean): Promise<ApiResponse<EventRegistration| null>> {
    if (detailed) {
      const event_registration =await this.eventRegisterRepository.findOne({
        where: { registration_id: id },
        relations: {
          paidUser: true,
          registeredEvent: true,
          payments:true
        }
      })
      if (!event_registration) {
        throw new NotFoundException( `event_registration with id ${id} not found`)
      }
      return {
        status: 'success',
        message: 'event_registration retrived success',
        data:event_registration
      }
    }
    const event_registration = await this.eventRegisterRepository.findOne({
      where: { registration_id: id }
    })
    if (!event_registration) {
      throw new NotFoundException(`event_registration with id ${id} not found`)
    }
    return {
      status: 'success',
      message: 'event_registration retrived success',
      data: event_registration
    }
  }

  async update(id: string, updateEventRegistrationDto: UpdateEventRegistrationDto) {
    const event_registration = await this.eventRegisterRepository.findOne({
      where: { registration_id: id }
    })
    if (!event_registration) {
      throw new NotFoundException(`event_registration with id ${id} not found`)
    }
    await this.eventRegisterRepository.update(id, updateEventRegistrationDto);
    return {
      status: 'success',
      message: 'event_registration updated success',
    }
  }

  async remove(id: string) {
    const event_registration = await this.eventRegisterRepository.findOne({
      where: { registration_id: id }
    })
    if (!event_registration) {
      throw new NotFoundException(`event_registration with id ${id} not found`)
    }
    await this.eventRegisterRepository.delete(id)
    return {
      status: 'success',
      message: 'event_registration deleted success'
    }
  }
}
