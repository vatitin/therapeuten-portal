import { Module } from '@nestjs/common';
import { TherapistController } from './controllers/therapist/therapist.controller';
import { TherapistService } from './services/therapist/therapist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entity/Patient.entity';
import { Therapist } from './entity/Therapist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Therapist])],
  controllers: [TherapistController],
  providers: [TherapistService],
})
export class TherapistModule {}
