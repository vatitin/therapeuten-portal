import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { TherapistService } from '../../services/therapist/therapist.service';
import { PatientDTO } from './patientDTO.entity';
import { AuthGuard } from 'src/auth/auth/auth.guard';
import { Session } from 'src/auth/session/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { Patient } from 'src/therapist/entity/Patient.entity';

@Controller('therapist')
export class TherapistController {
  constructor(private therapistService: TherapistService) {}

  @Get('findPatient/:id')
  async findPatient(@Param('id', ParseIntPipe) id: number) {
    const patient = await this.therapistService.findPatientById(id);
    if (patient) return patient;
    else throw new HttpException('Patient not found', HttpStatus.BAD_REQUEST);
  }

  @Post('createPatient')
  @UsePipes(ValidationPipe)
  createPatient(@Body() patientDTO: PatientDTO) {
    return this.therapistService.createPatient(patientDTO);
  }

  @Get('patients')
  @UseGuards(new AuthGuard())
  async getPatientsFromTherapist(
    @Session() session: SessionContainer,
  ): Promise<Patient[]> {
    const userId = session.getUserId();

    const patients =
      await this.therapistService.getPatientsFromTherapist(userId);

    if (patients) return patients;
    else throw new HttpException('Patients not found', HttpStatus.BAD_REQUEST);
  }
}
