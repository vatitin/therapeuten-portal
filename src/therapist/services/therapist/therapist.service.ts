import { Injectable } from '@nestjs/common';
import { PatientDTO } from '../../controllers/therapist/patientDTO.entity';

@Injectable()
export class TherapistService {
  patients = [
    {
      id: 1,
      email: 'a@email.com',
    },
    {
      id: 2,
      email: 'b@email.com',
    },
  ];

  findPatientById(id: number) {
    return this.patients.find((patient) => patient.id === id);
  }

  createPatient(PatientDTO: PatientDTO) {
    this.patients.push(PatientDTO);
  }

  getPatients() {
    return this.patients;
  }
}
