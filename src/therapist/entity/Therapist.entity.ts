import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Therapist {
    @Column('uuid')
    @PrimaryColumn()
    id: string;

    @Column({ unique: true, length: 32, nullable: false })
    email: string;
}
