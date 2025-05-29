import { Feedback } from 'src/feedback/entities/feedback.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity({name:'users'})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ unique: true })
  email: string;

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

  // feedback 1->M
  @OneToMany(()=> Feedback,(feedback)=>feedback.owner)
  feedback: Feedback[];

  @OneToMany(() => Payment, (payment) => payment.whoPaid)
  payments: Payment[];
}
