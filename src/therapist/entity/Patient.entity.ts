import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type GenderType = 'M' | 'W' | 'D';

@Entity()
export class Patient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    isRegistered: boolean;

    @Column({ length: 32, nullable: true })
    email: string;

    @Column({ length: 32, nullable: true })
    firstName?: string;

    @Column({ length: 32, nullable: true })
    lastName: string;

    @Column({ length: 32, nullable: true })
    phoneNumber: string;

    @Column({ length: 32, nullable: true })
    gender: GenderType;
}
