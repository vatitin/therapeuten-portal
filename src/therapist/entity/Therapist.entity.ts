import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Therapist {
    @Column('uuid')
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    keycloakId: string;

}
