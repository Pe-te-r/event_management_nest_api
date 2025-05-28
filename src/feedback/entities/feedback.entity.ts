import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  feedback_id: string;
  
  @Column({ type: 'number' })
  rating: number;

  @Column('text')
  comments: string;

  @Column({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    createAt: Date;
}
