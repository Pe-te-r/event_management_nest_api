import { RegistationStatus } from "src/common/types/enums";
import { Event } from "src/events/entities/event.entity";
import { Payment } from "src/payments/entities/payment.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class EventRegistration {
  @PrimaryGeneratedColumn('uuid')
  registration_id: string;

  @Column('date')
  registration_date: Date;

  @Column({ type: 'enum', enum: RegistationStatus, default: RegistationStatus.PENDING})
  payment_status: RegistationStatus;

  @Column({ type:'decimal',scale:2})
  payment_amount: number;

  // user who paid M -> 1
  @ManyToOne(() => User, (user) => user.registeredEvents, { onDelete: 'CASCADE' })
  paidUser: User;

  // event
  @ManyToOne(() => Event, (event) => event.registrations, { onDelete: 'CASCADE' })
  registeredEvent: Event;

  // payment
  @OneToMany(() => Payment, (payment) => payment.whichEvent, { onDelete: 'CASCADE' })
  payments: Payment[]
}
