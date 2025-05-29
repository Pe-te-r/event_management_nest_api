import { User } from "src/users/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ManyToOne } from "typeorm/browser";
@Entity({name:'payments'})
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  payment_id: string;

  @Column({type:'decimal',precision:3,scale:2})
  amount: number;

  @Column()
  payment_method: string;

  @Column()
  payment_status: string;

  @ManyToOne(() => User, (user) => user.payments)
  whoPaid: User;
}
