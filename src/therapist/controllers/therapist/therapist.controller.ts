import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { TherapistService } from '../../services/therapist/therapist.service';
import { Request, Response } from 'express';
import { PatientDTO } from './patientDTO.entity';
import { TherapistDTO } from './therapistDTO.entity';
import { AuthGuard } from 'src/auth/auth/auth.guard';
import { Session } from 'src/auth/session/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Controller('therapist')
export class TherapistController {
  constructor(private therapistService: TherapistService) {}
  //this and the other get controller do the same but the second one is with nest and the upper one express
  @Get('patient/:id')
  getTherapist(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const patient = this.therapistService.findPatientById(id);
    if (patient) {
      res.send(patient);
    } else {
      res.status(400).send({ msg: 'Customer not found!' });
    }
  }

  @Get('findPatient/:id')
  findPatient(@Param('id', ParseIntPipe) id: number) {
    const patient = this.therapistService.findPatientById(id);
    if (patient) return patient;
    else throw new HttpException('Customer not found', HttpStatus.BAD_REQUEST);
  }

  @Post('createPatient')
  @UsePipes(ValidationPipe)
  createPatient(@Body() patientDTO: PatientDTO) {
    return this.therapistService.createPatient(patientDTO);
  }

  @Post('signIn')
  @UsePipes(ValidationPipe)
  signIn(@Body() therapistDTO: TherapistDTO) {
    return this.therapistService.createTherapist(therapistDTO);
  }

  @Get('patients/:therapistId')
  getPatientsFromTherapist(
    @Param('therapistId', ParseIntPipe) therapistId: number,
  ) {
    return this.therapistService.getPatientsFromTherapist(therapistId);
  }

  @Get('test')
  @UseGuards(new AuthGuard())
  async getTest(@Session() session: SessionContainer): Promise<string> {
    console.log(session);
    // TODO: magic
    return 'magic';
  }
}
