import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Patient } from './Patient.entity';

@Entity()
export class Therapist {
  @Column('uuid')
  @PrimaryColumn()
  id: string;

  @Column({ unique: true, length: 32, nullable: false })
  email: string;

  @OneToMany(() => Patient, (patient) => patient.therapist)
  patients: Patient[];
}
