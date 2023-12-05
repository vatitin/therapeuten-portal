import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Therapist } from './Therapist.entity';

export type GenderType = 'M' | 'W' | 'D';

@Entity()
export class Patient {
  @Column('int')
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32 })
  email: string;

  @Column({ length: 32 })
  firstName: string;

  @Column({ length: 32 })
  lastName: string;

  @Column({ length: 32 })
  gender: GenderType;

  @ManyToOne(() => Therapist, (therapist) => therapist.patients)
  therapist: Therapist;
}
