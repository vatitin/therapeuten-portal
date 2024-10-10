import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Therapist } from './Therapist.entity';
import { Patient } from './Patient.entity';

export enum StatusType {
    Active = 'active',
    Inactive = 'inactive',
    Waiting = 'waiting',
  }

@Entity()
export class PatientTherapist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, patient => patient.id, { nullable: false })
  patient: Patient;

  @ManyToOne(() => Therapist, therapist => therapist.id, { nullable: false })
  therapist: Therapist;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  lastStatusChange: Date;

  @Column({ type: 'enum', enum: StatusType, default: 'waiting' })
  status: StatusType;
}