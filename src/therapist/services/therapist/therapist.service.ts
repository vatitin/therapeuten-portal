import {
    BadRequestException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientTherapistDTO } from 'src/therapist/controllers/therapist/PatientTherapistDTO.entity';
import { TherapistDTO } from 'src/therapist/controllers/therapist/therapistDTO.entity';
import { Patient } from 'src/therapist/entity/Patient.entity';
import {
    PatientTherapist,
    StatusType,
} from 'src/therapist/entity/PatientTherapist.entity';
import { Therapist } from 'src/therapist/entity/Therapist.entity';
import { Repository } from 'typeorm';
import { PatientDTO } from '../../controllers/therapist/patientDTO.entity';

@Injectable()
export class TherapistService {
    constructor(
        @InjectRepository(Patient)
        private readonly patientRepository: Repository<Patient>,

        @InjectRepository(Therapist)
        private readonly therapistRepository: Repository<Therapist>,

        @InjectRepository(PatientTherapist)
        private readonly patientTherapistRepository: Repository<PatientTherapist>,
    ) {}

    async createPatient(
        patientDTO: PatientDTO,
        therapistUUID: string,
        status: StatusType,
    ) {
        patientDTO.isRegistered = false;

        const therapist = await this.therapistRepository.findOneOrFail({
            where: { id: therapistUUID },
        });

        if (!therapist) {
            throw new BadRequestException('Therapist wurde nicht gefunden');
        }

        const patient = await this.patientRepository.save(patientDTO);

        const patientTherapistDTO: PatientTherapistDTO = {
            therapist: therapist,
            patient: patient,
            status,
            lastStatusChange: new Date(),
        };

        await this.patientTherapistRepository.save(patientTherapistDTO);
        return patient;
    }

    async findPatientTherapist(patientId: string, therapistId: string) {
        const patientTherapist = await this.patientTherapistRepository.findOne({
            where: {
                patient: { id: patientId },
                therapist: { id: therapistId },
            },
        });
        if (!patientTherapist)
            throw new NotFoundException(
                'Patient-Therapist relationship not found',
            );
        return patientTherapist;
    }

    async updatePatient(
        id: string,
        patientDTO: PatientDTO,
        userId: string,
        status: StatusType,
    ) {
        const { patient, patientTherapist } = await this.getPatient(id, userId);
        if (status) {
            patientTherapist.status = status;
            this.patientTherapistRepository.save(patientTherapist);
        }
        if (patientDTO.firstName) patient.firstName = patientDTO.firstName;
        if (patientDTO.lastName) patient.lastName = patientDTO.lastName;
        if (patientDTO.email) patient.email = patientDTO.email;
        if (patientDTO.phoneNumber)
            patient.phoneNumber = patientDTO.phoneNumber;

        return await this.patientRepository.save(patient);
    }

    async createTherapist(therapistDTO: TherapistDTO, id: string) {
        const therapist = this.therapistRepository.create(therapistDTO);
        therapist.id = id;
        return await this.therapistRepository.save(therapist);
    }

    async getProfile(id: string) {
        const therapist = await this.therapistRepository.findOne({
            where: { id },
        });
        if (therapist) return therapist;
        else throw new BadRequestException('Therapist could not be found');
    }

    async getPatientsFromTherapist(id: string, status: StatusType) {
        const patientTherapists: PatientTherapist[] =
            await this.patientTherapistRepository.find({
                where: { therapist: { id }, status },
                relations: ['patient'],
                order: {
                    lastStatusChange: 'ASC',
                },
            });

        const patientsWithSequence = patientTherapists.map(
            (patientTherapist, index) => ({
                ...patientTherapist.patient,
                sequence: index + 1,
            }),
        );

        return patientsWithSequence;
    }

    async getPatient(id: string, userId: string) {
        const patient = await this.patientRepository.findOne({
            where: { id },
        });
        if (!patient) throw new NotFoundException('Patient could not be found');

        const patientTherapist = await this.patientTherapistRepository.findOne({
            where: { patient: { id }, therapist: { id: userId } },
        });

        if (!patientTherapist)
            throw new NotFoundException(
                'Patient-Therapist relationship could not be found',
            );
        return { patient, patientTherapist };
    }

    async removePatient(patientId: string, therapistId: string) {
        const { patient, patientTherapist } = await this.getPatient(patientId, therapistId);
        await this.patientTherapistRepository.remove(patientTherapist)
        if(patient.isRegistered) {
            await this.patientRepository.remove(patient);
            return { status: HttpStatus.OK, message: 'Patient-Therapist relation and patient removed' };
        }
        return { status: HttpStatus.OK, message: 'Patient-Therapist relation removed' };
    }
}
