import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Therapist {
  @Column('int')
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 32 })
  email!: string;

  @Column({ length: 32 })
  password!: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
