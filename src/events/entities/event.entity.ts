import { Column, PrimaryGeneratedColumn } from "typeorm";

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
}
