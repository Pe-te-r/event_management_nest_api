import { PaymentStatus } from "src/common/types/enums";
import { EventRegistration } from "src/event_registrations/entities/event_registration.entity";
import { Event } from "src/events/entities/event.entity";
import { User } from "src/users/entities/user.entity";
import { Column, ManyToOne,Entity, PrimaryGeneratedColumn, OneToOne, OneToMany } from "typeorm";
@Entity({name:'payments'})
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  payment_id: string;

  @Column({type:'decimal',scale:2})
  amount: number;

  @Column()
  payment_method: string;

  @Column({type:'enum', enum:PaymentStatus,default:PaymentStatus.PENDING})
  payment_status: PaymentStatus;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  whoPaid: User;

  @ManyToOne(() => EventRegistration, (event_register) => event_register.payments, { onDelete: 'CASCADE' })
  registration: EventRegistration;

  @ManyToOne(() => Event, (event) => event.payments, { onDelete: 'CASCADE' })
  whichEvent: Event;
  
  
}
