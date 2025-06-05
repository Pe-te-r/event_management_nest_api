import { RoleEnum } from 'src/common/types/enums';
import { EventRegistration } from 'src/event_registrations/entities/event_registration.entity';
import { Event } from 'src/events/entities/event.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;

  @Column()
  password: string;

  @Column({ nullable: true, })
  hashed_token?: string;

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

  @OneToMany(() => Event, (event) => event.createdBy)
  createdEvents: Event[];

  // feedback 1->M
  @OneToMany(() => Feedback, (feedback) => feedback.owner)
  feedback: Feedback[];

  // payment 1 -> M
  @OneToMany(() => Payment, (payment) => payment.whoPaid)
  payments: Payment[];

  // registration 1 -> M
  @OneToMany(() => EventRegistration, (event_register) => event_register.paidUser)
  registeredEvents: EventRegistration[]

}
