import { Injectable } from '@nestjs/common';
import { PatientDTO } from '../../controllers/therapist/patientDTO.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/therapist/entity/Patient.entity';
import { Repository } from 'typeorm';
import { TherapistDTO } from 'src/therapist/controllers/therapist/therapistDTO.entity';
import { Therapist } from 'src/therapist/entity/Therapist.entity';

@Injectable()
export class TherapistService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    @InjectRepository(Therapist)
    private readonly therapistRepository: Repository<Therapist>,
  ) {}

  findPatientById(id: number) {
    return { a: id };
  }

  createPatient(patientDTO: PatientDTO) {
    const patient = this.patientRepository.create(patientDTO);
    return this.patientRepository.save(patient);
  }

  createTherapist(therapistDTO: TherapistDTO) {
    const therapist = this.therapistRepository.create(therapistDTO);
    return this.therapistRepository.save(therapist);
  }

  getPatientsFromTherapist(id: string) {
    return this.patientRepository.find({
      where: { therapist: { id } },
    });
  }
}
