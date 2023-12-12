import { BadRequestException, Injectable } from '@nestjs/common';
import { PatientDTO } from '../../controllers/therapist/patientDTO.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient, StatusType } from 'src/therapist/entity/Patient.entity';
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

  async createPatient(
    patientDTO: PatientDTO,
    therapistUUID: string,
    status: StatusType,
  ) {
    const patient = this.patientRepository.create(patientDTO);
    const therapist = await this.therapistRepository.findOneOrFail({
      where: { id: therapistUUID },
    });
    patient.status = status;
    patient.therapist = therapist;
    return this.patientRepository.save(patient);
  }

  createTherapist(therapistDTO: TherapistDTO) {
    const therapist = this.therapistRepository.create(therapistDTO);
    return this.therapistRepository.save(therapist);
  }

  getPatientsFromTherapist(id: string, status: StatusType) {
    return this.patientRepository.find({
      where: { therapist: { id }, status },
    });
  }
}
