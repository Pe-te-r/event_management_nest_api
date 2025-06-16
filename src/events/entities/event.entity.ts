import { EventRegistration } from "src/event_registrations/entities/event_registration.entity";
import { Feedback } from "src/feedback/entities/feedback.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'events'})
export class Event {
  @PrimaryGeneratedColumn('uuid')
  event_id: string;

  @Column()
  event_name: string;

  @Column('date')
  event_date: Date;

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
  // one event created by a user
  @ManyToOne(() => User, (user) => user.createdEvents, { cascade: true, onDelete: 'CASCADE' })
  createdBy: User;
  
  // one event with many feedbacks
  @OneToMany(() => Feedback, (feedback) => feedback.event,{cascade:true})
  feedbacks: Feedback[];

  // one event with multiple registration
  @OneToMany(() => EventRegistration, (event_registration) => event_registration.registeredEvent,{cascade:true})
  registrations: EventRegistration[]
}

