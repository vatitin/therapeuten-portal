import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
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
import { Patient, StatusType } from 'src/therapist/entity/Patient.entity';
import { StatusTypeValidationPipe } from './statusType.validation.pipe';

@Controller('therapist')
export class TherapistController {
  constructor(private therapistService: TherapistService) {}

  /*
  @Get('findPatient/:id')
  async findPatient(@Param('id', ParseIntPipe) id: number) {
    const patient = await this.therapistService.findPatientById(id);
    if (patient) return patient;
    else throw new HttpException('Patient not found', HttpStatus.BAD_REQUEST);
  }
  */

  @Patch('updatePatient/:id/:status')
  @UsePipes(ValidationPipe)
  @UseGuards(new AuthGuard())
  updatePatient(
    @Param('id') id: number,
    @Param('status', StatusTypeValidationPipe) status: StatusType,
    @Session() session: SessionContainer,
    @Body() patientDTO: PatientDTO,
  ) {
    return this.therapistService.updatePatient(
      id,
      patientDTO,
      session.getUserId(),
      status,
    );
  }

  @Post('createPatient/:status')
  @UsePipes(ValidationPipe)
  @UseGuards(new AuthGuard())
  createPatient(
    @Param('status', StatusTypeValidationPipe) status: StatusType,
    @Session() session: SessionContainer,
    @Body() patientDTO: PatientDTO,
  ) {
    return this.therapistService.createPatient(
      patientDTO,
      session.getUserId(),
      status,
    );
  }

  @Get('myProfile')
  @UseGuards(new AuthGuard())
  async getProfile(@Session() session: SessionContainer) {
    return await this.therapistService.getProfile(session.getUserId());
  }

  @Get('patients/:status')
  @UseGuards(new AuthGuard())
  async getPatientsFromTherapist(
    @Param('status', StatusTypeValidationPipe) status: StatusType,
    @Session() session: SessionContainer,
  ): Promise<Patient[]> {
    const userId = session.getUserId();

    const patients = await this.therapistService.getPatientsFromTherapist(
      userId,
      status,
    );

    if (patients) return patients;
    else throw new HttpException('Patients not found', HttpStatus.BAD_REQUEST);
  }

  @Get('patients/byId/:id')
  @UseGuards(new AuthGuard())
  async getPatient(
    @Param('id') id: number,
    @Session() session: SessionContainer,
  ): Promise<Patient> {
    const userId = session.getUserId();
    return await this.therapistService.getPatient(id, userId);
  }
    
}
