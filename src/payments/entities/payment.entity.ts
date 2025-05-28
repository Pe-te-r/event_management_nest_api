import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  payment_id: string;

  @Column({type:'decimal',precision:3,scale:2})
  amount: number;

  @Column()
  payment_method: string;

  @Column()
  payment_status: string;
}
