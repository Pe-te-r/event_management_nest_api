import { RegistationStatus } from "src/common/types/enums";
import { Event } from "src/events/entities/event.entity";
import { Payment } from "src/payments/entities/payment.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class EventRegistration {
  @PrimaryGeneratedColumn('uuid')
  registration_id: string;

  @Column()
  event_id: string;

  @Column('date')
  registration_date: string;

  @Column({ type: 'enum', enum: RegistationStatus, default: RegistationStatus.PENDING})
  payment_status: RegistationStatus;

  @Column({ type:'decimal',precision:3,scale:2})
  payment_amount: number;

  // user who paid M -> 1
  @ManyToOne(() => User, (user) => user.registeredEvents)
  paidUser: User;

  // event
  @ManyToOne(() => Event, (event) => event.registrations)
  registeredEvent: Event;

  // payment
  @OneToMany(() => Payment, (payment) => payment.whichEvent)
  payments: Payment[]
}
