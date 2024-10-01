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

  async createPatient(
    patientDTO: PatientDTO,
    therapistUUID: string,
    status: StatusType,
  ) {
    const patient = this.patientRepository.create(patientDTO);
    const therapist = await this.therapistRepository.findOneOrFail({
      where: { id: therapistUUID },
    });
    if (!therapist) {
      throw new BadRequestException('Therapist wurde nicht gefunden');
    }
    if (status === 'W') patient.addedAsWaitingDate = new Date();
    patient.status = status;
    patient.therapist = therapist;
    return this.patientRepository.save(patient);
  }

  createTherapist(therapistDTO: TherapistDTO) {
    const therapist = this.therapistRepository.create(therapistDTO);
    return this.therapistRepository.save(therapist);
  }

  async getProfile(id: string) {
    const therapist = await this.therapistRepository.findOne({
      where: { id },
    });
    if (therapist) return therapist;
    else throw new BadRequestException('Therapist could not be found');
  }

  async getPatientsFromTherapist(id: string, status: StatusType) {
    const patients = await this.patientRepository.find({
      where: { therapist: { id }, status },
      order: {
        addedAsWaitingDate: 'ASC',
      },
    });

    const patientsWithSequence = patients.map((patient, index) => ({
      ...patient,
      sequence: index + 1,
    }));
    return patientsWithSequence;
  }

  async getPatient(id: number, userId: string) {
    const patient = await this.patientRepository.findOne({
      where: 
      {id}, 
      relations: ['therapist'],
    })
    
    if (!patient || patient.therapist.id !== userId) throw new BadRequestException('Patient could not be found');
    return patient;
  }
}
