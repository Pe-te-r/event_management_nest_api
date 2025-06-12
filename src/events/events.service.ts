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
  async create(createEventDto: CreateEventDto, createdById:string) {
    const newEvent = this.eventRepository.create({
      event_name: createEventDto.event_name,
      event_date: createEventDto.event_date,
      createdBy:{id: createdById},
      event_location: createEventDto.event_location,
      event_description: createEventDto.event_description,
    })
    const savedEvent =await this.eventRepository.save(newEvent)
    console.log(savedEvent)
    return {
      status: 'success',
      message: 'This action adds a new event'
    }
  }

  private async getEvents(detailed: boolean,id:string | null=null) {
    let events;
    if(detailed && !id) {
      events = await this.eventRepository
        .createQueryBuilder('events')
        .leftJoinAndSelect('events.feedbacks', 'feedbacks')
        .leftJoin('events.registrations', 'registrations')
        .select([
          'events.event_id',
          'events.event_name',
          'events.event_date',
          'events.event_description',
          'feedbacks.feedback_id',
          'feedbacks.rating',
          'feedbacks.comments',
          'COUNT(registrations.registration_id) AS registration_count',
          'AVG(feedbacks.rating) AS average_rating',
        ])
        .groupBy('events.event_id')
        .addGroupBy('feedbacks.feedback_id')
        .addGroupBy('events.event_name')
        .addGroupBy('events.event_date')
        .addGroupBy('events.event_description')
        .addGroupBy('feedbacks.rating')
        .addGroupBy('feedbacks.comments')
        .getRawMany();
    } else if (detailed && id) {
      const rawRows = await this.eventRepository
        .createQueryBuilder('events')
        .leftJoinAndSelect('events.feedbacks', 'feedbacks')
        .leftJoin('events.registrations', 'registrations')
        .select([
          'events.event_id',
          'events.event_name',
          'events.event_date',
          'events.event_description',
          'feedbacks.feedback_id',
          'feedbacks.rating',
          'feedbacks.comments',
          'COUNT(registrations.registration_id) AS registration_count',
          'AVG(feedbacks.rating) AS average_rating',
        ])
        .where('events.event_id = :id', { id })
        .groupBy('events.event_id')
        .addGroupBy('feedbacks.feedback_id')
        .addGroupBy('events.event_name')
        .addGroupBy('events.event_date')
        .addGroupBy('events.event_description')
        .addGroupBy('feedbacks.rating')
        .addGroupBy('feedbacks.comments')
        .getRawMany();

      if (rawRows.length === 0) {
        events = null;
      } else {
        events = {
          event_id: rawRows[0].events_event_id,
          event_name: rawRows[0].events_event_name,
          event_date: rawRows[0].events_event_date,
          event_description: rawRows[0].events_event_description,
          registration_count: Number(rawRows[0].registration_count),
          average_rating: parseFloat(Number(rawRows[0].average_rating).toFixed(2)),
          feedbacks: []
        };
        
        console.log(events)
        rawRows.forEach(row => {
          if (row.feedbacks_feedback_id) {
            events.feedbacks.push({
              feedback_id: row.feedbacks_feedback_id,
              rating: row.feedbacks_rating,
              comments: row.feedbacks_comments
            });
          }
        });
      }
      return events;
    }
    else if (!detailed && id) {
      events = await this.eventRepository.findOne({
        where: { event_id: id }
      })
    } else {
      events = await this.eventRepository.find()
    }

    const grouped = new Map();
    if (events.length > 1) {
      
      events.forEach(row => {
        const eventId = row.events_event_id;
        
      if (!grouped.has(eventId)) {
        grouped.set(eventId, {
          event_id: row.events_event_id,
          event_name: row.events_event_name,
          event_date: row.events_event_date,
          event_description: row.events_event_description,
          registration_count: Number(row.registration_count),
          average_rating: parseFloat(Number(row.average_rating).toFixed(2)),
          feedbacks: []
        });
      }

      // Push feedback if it exists
      if (row.feedbacks_feedback_id) {
        grouped.get(eventId).feedbacks.push({
          feedback_id: row.feedbacks_feedback_id,
          rating: row.feedbacks_rating,
          comments: row.feedbacks_comments
        });
      }
    });
    return Array.from(grouped.values());
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

  async findOne(id: string,detailed:boolean=false) {
    if (detailed) {
      const event = await this.getEvents(detailed, id);
      if (!event) {
        throw new NotFoundException(`Event with id ${id} not found`);
      }
      return {
        status: 'success',
        message: 'event found',
        data: event
      }

    }
    const event = await this.getEvents(detailed, id);
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
