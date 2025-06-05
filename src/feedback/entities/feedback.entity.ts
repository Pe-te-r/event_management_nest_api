import { Event } from "src/events/entities/event.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity({name:'feedbacks'})
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

  // M -> 1 [feedbacks]event
  @ManyToOne(() => Event, (even) => even.feedbacks, { onDelete: 'CASCADE' })
  event: Event
  
  // M -> 1 [feedbacks]user
  @ManyToOne(() => User, (user) => user.feedback, { onDelete: 'CASCADE' })
  owner: User

  
}
