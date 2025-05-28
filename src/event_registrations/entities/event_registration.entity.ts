import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class EventRegistration {
  @PrimaryGeneratedColumn('uuid')
  registration_id: string;

  @Column()
  event_id: string;

  @Column('date')
  registration_date: string;

  @Column()
  payment_status: string;

  @Column({ type:'decimal',precision:3,scale:2})
  payment_amount: number;
}
