import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Patient } from './Patient.entity';

@Entity()
export class Therapist {
  @Column('int')
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 32, nullable: false })
  email: string;

  @Column('uuid')
  superTokensUserId: string;

  /*
  @Column({ length: 32 })
  firstName: string;

  @Column({ length: 32 })
  lastName: string;
*/

  @OneToMany(() => Patient, (patient) => patient.therapist)
  patients: Patient[];
}
