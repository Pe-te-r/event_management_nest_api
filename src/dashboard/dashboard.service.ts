import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRegistration } from 'src/event_registrations/entities/event_registration.entity';
import { Event } from 'src/events/entities/event.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
        @InjectRepository(Event) private eventRepository: Repository<Event>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Feedback) private feedbackRepository: Repository<Feedback>,
        @InjectRepository(EventRegistration) private registrationRepository: Repository<EventRegistration>,
    
  ) { }
  
  async getDashboard() {
    const [totalUsers, totalEvents, totalRegistrations, totalPayments, totalRevenue] = await Promise.all([
      this.userRepository.count(),
      this.eventRepository.count(),
      this.registrationRepository.count(),
      this.registrationRepository
        .createQueryBuilder('reg')
        .select('SUM(reg.payment_amount)', 'total')
        .getRawOne()
        .then(res => parseFloat(res.total) || 0),
      this.registrationRepository
        .createQueryBuilder('reg')
        .select('SUM(reg.payment_amount)', 'total')
        .getRawOne()
        .then(res => parseFloat(res.total) || 0),
    ]);

    return {
      totalUsers,
      totalEvents,
      totalRegistrations,
      totalPayments,
      totalRevenue,
      // Add more like charts, top users, feedback summaries etc. as needed
    };
  }
  
}
