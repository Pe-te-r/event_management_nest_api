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

  private async getEvents(detailed: boolean,id:string | null=null) {
    let events;
    if(detailed && !id) {
      events = await this.eventRepository
        .createQueryBuilder('events')
        .leftJoinAndSelect('events.feedbacks', 'feedbacks')
        .leftJoinAndSelect('events.registrations', 'registrations')
        .select([
          'events.event_id',
          'events.event_name',
          'events.event_date',
          'events.event_description',
          'feedbacks.feedback_id',
          'feedbacks.rating',
          'feedbacks.comments',
          'registrations.registration_id',
          'registrations.registration_date',
          'registrations.payment_status',
          'registrations.payment_amount',
        ]).getMany();
    } else if (detailed && id) {
      events = await this.eventRepository
        .createQueryBuilder('events')
        .leftJoinAndSelect('events.feedbacks', 'feedbacks')
        .leftJoinAndSelect('events.registrations', 'registrations')
        .select([
          'events.event_id',
          'events.event_name',
          'event.event_date',
          'event.event_description',
          'feedbacks.feedback_id',
          'feedbacks.rating',
          'feedbacks.comments',
          'registrations.registration_id',
          'registrations.registration_date',
          'registrations.payment_status',
          'registrations.payment_amount',
        ])
        .where('events.event_id=:id',{id})
        .getOne();
    } else if (!detailed && id) {
      events = await this.eventRepository.findOne({
        where: { event_id: id }
      })
    } else {
      events = await this.eventRepository.find()
    }
    return events;
  }

  async findAll(detailed:boolean=false): Promise<ApiResponse<Event[] | null>> {
    if (detailed) {
      const events = await this.getEvents(detailed);
      if (!events) {
        throw new NotFoundException('no events found')
      }
      return {
        status: 'success',
        message: 'events retrived',
        data:events 
      }
      
    }

    const events = await this.eventRepository.find()
    if (!events) {
     throw new NotFoundException('no events found')
    }
    return {
      status: 'success',
      message: 'events retrived',
      data:events
    }
  }

  async findOne(id: string,detailed:boolean=false): Promise<ApiResponse<Event | null>> {
    if (detailed) {
      const event = await this.eventRepository.findOne({
        where: { event_id: id },
        relations: { feedbacks: true, registrations: true }
      })
      if (!event) {
        throw new NotFoundException(`Event with id ${id} not found`);
      }
      return {
        status: 'success',
        message: 'event found',
        data: event
      }

    }
    const event =await this.eventRepository.findOne({
      where:{event_id:id}
    })
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return {
      status: 'success',
      message: 'event found',
      data: event
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    await this.eventRepository.update(id,updateEventDto);
    return {
      status: 'success',
      message: `event id ${id} updated success`,
    }  }
    
    async remove(id: string) {
      await this.eventRepository.delete(id)
      return {
        status: 'success',
        message: `event id ${id} deleted success`,
    }
  }
}
