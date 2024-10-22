import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth/auth.guard';
import { Session } from 'src/auth/session/session.decorator';
import { Patient } from 'src/therapist/entity/Patient.entity';
import { StatusType } from 'src/therapist/entity/PatientTherapist.entity';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { TherapistService } from '../../services/therapist/therapist.service';
import { PatientDTO } from './patientDTO.entity';
import { StatusTypeValidationPipe } from './statusType.validation.pipe';

@Controller('therapist')
export class TherapistController {
    constructor(private therapistService: TherapistService) {}

    @Patch('updatePatient/:id/:status')
    @UsePipes(ValidationPipe)
    @UseGuards(new AuthGuard())
    updatePatient(
        @Param('id') id: string,
        @Param('status', new StatusTypeValidationPipe(false))
        status: StatusType,
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

    @Delete('removePatient/:id')
    @UsePipes(ValidationPipe)
    @UseGuards(new AuthGuard())
    async removePatient(
        @Param('id') id: string,
        @Session() session: SessionContainer,
    ) {
        return await this.therapistService.removePatient(id, session.getUserId())
    }

    @Post('createPatient/:status')
    @UsePipes(ValidationPipe)
    @UseGuards(new AuthGuard())
    async createPatient(
        @Param('status', new StatusTypeValidationPipe()) status: StatusType,
        @Session() session: SessionContainer,
        @Body() patientDTO: PatientDTO,
    ) {
        return await this.therapistService.createPatient(
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
        @Param('status', new StatusTypeValidationPipe()) status: StatusType,
        @Session() session: SessionContainer,
    ): Promise<Patient[]> {
        const userId = session.getUserId();

        const patients = await this.therapistService.getPatientsFromTherapist(
            userId,
            status,
        );

        return patients;
    }

    @Get('patients/byId/:id')
    @UseGuards(new AuthGuard())
    async getPatient(
        @Param('id') id: string,
        @Session() session: SessionContainer,
    ): Promise<Patient> {
        const userId = session.getUserId();
        const { patient, patientTherapist } =
            await this.therapistService.getPatient(id, userId);
        return patient;
    }
}
