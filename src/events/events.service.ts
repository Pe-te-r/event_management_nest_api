import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/responseType';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
  ){}
  async create(createEventDto: CreateEventDto) {
    const newEvent = this.eventRepository.create({
      event_name: createEventDto.event_name,
      event_date: createEventDto.event_date,
      createdBy:{id: createEventDto.createdById},
      event_location: createEventDto.event_location,
      event_description: createEventDto.event_description,
    })
    const savedEvent =await this.eventRepository.save(newEvent)
    console.log(savedEvent)
    return 'This action adds a new event';
  }

  async findAll(): Promise<ApiResponse<Event[] | null>> {
    const events = await this.eventRepository.find()
    if (!events) {
      return {
        status: 'error',
        message:'no event found',
      }
    }

    return {
      status: 'success',
      message: 'all the events found',
      data:events
    }
  }

  async findOne(id: string): Promise<ApiResponse<Event | null>> {
    const event =await this.eventRepository.findOne({
      where:{event_id:id}
    })
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
      // return {
      //   status: 'error',
      //   message:`event with id ${id} not found`
      // }
    }
    return {
      status: 'success',
      message: 'event found',
      data: event
    }
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: string) {
    return `This action removes a #${id} event`;
  }
}
