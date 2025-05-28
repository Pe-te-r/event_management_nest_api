import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Payment {
  @PrimaryGeneratedColumn('uuid')
  payment_id: string;

  @Column({type:'number', precision:3,scale:2})
  amount: number;

  @Column()
  payment_method: string;

  @Column()
  payment_status: string;
}
