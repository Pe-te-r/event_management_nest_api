import { Feedback } from "src/feedback/entities/feedback.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'events'})
export class Event {
  @PrimaryGeneratedColumn('uuid')
  event_id: string;

  @Column()
  event_name: string;

  @Column('date')
  event_date: string;

  @Column()
  event_location: string;

  @Column()
  event_description: string;
  
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
  
  @OneToMany(() => Feedback, (feedback) => feedback.event)
  feedbacks: Feedback[];
}
