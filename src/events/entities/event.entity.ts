import { EventRegistration } from "src/event_registrations/entities/event_registration.entity";
import { Feedback } from "src/feedback/entities/feedback.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'events'})
export class Event {
  @PrimaryGeneratedColumn('uuid')
  event_id: string;

  @Column()
  event_name: string;

  @Column('date')
  event_date: string;

  @Column()
  event_location: string;

  @Column()
  event_description: string;
  
  @Column({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    createAt: Date;
  
    @Column({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updateAt: Date;
  
  // one event with many feedbacks
  @OneToMany(() => Feedback, (feedback) => feedback.event)
  feedbacks: Feedback[];

  // one event with multiple registration
  @OneToMany(() => EventRegistration, (event_registration) => event_registration.registeredEvent)
  registrations: EventRegistration[]
}
