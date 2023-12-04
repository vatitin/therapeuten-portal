import { Injectable } from '@nestjs/common';

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
}
