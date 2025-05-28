import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  feedback_id: string;
  
  @Column()
  rating: number;

  @Column('text')
  comments: string;

  @Column({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    createAt: Date;
}
