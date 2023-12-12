import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Therapist } from './Therapist.entity';

export type GenderType = 'M' | 'W' | 'D';
// Active, Waiting, Former
export type StatusType = 'A' | 'W' | 'F';

@Entity()
export class Patient {
  @Column('int')
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, nullable: true })
  email: string;

  @Column({ length: 32, nullable: true })
  firstName?: string;

  @Column({ length: 32, nullable: true })
  lastName: string;

  @Column({ length: 32, nullable: true })
  phoneNumber: string;

  @Column({ length: 1 })
  status: StatusType;

  @Column({ length: 32, nullable: true })
  gender: GenderType;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  addedAsWaitingDate: Date | undefined;

  @ManyToOne(() => Therapist, (therapist) => therapist.patients)
  therapist: Therapist;
}
