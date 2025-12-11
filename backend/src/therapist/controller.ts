import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';

import { AuthenticatedUser, AuthGuard, RoleGuard, Roles } from 'nest-keycloak-connect';
import { Association, StatusType } from 'src/association/entity';
import { KeycloakUserDTO } from 'src/keycloak-user.dto';
import { LocalPatientDTO } from 'src/patient/create-local.dto';
import { Patient } from 'src/patient/entity';
import { StatusTypeValidationPipe } from './statusType.validation.pipe';
import { TherapistFormDTO } from './TherapistFormDTO.entity';
import { TherapistWorkflowService } from './worfklow.service';
import { TherapistUpdateDTO } from './update.dto';
import { CreateTherapistCommentDto } from 'src/comment/create-therapist-comment.dto';
import { TherapistAuthGuard } from './therapist-auth.guard';

    
@UseGuards(AuthGuard)
@Controller('therapist')
export class TherapistController {
    constructor(
        private therapistWorkflowService: TherapistWorkflowService,
    ) {}

    @Get('myProfile')
    async getProfile(@AuthenticatedUser() therapist: KeycloakUserDTO) {
        return await this.therapistWorkflowService.getProfile(therapist);
    }

    @Get('hasLocalTherapist')
    async hasLocalTherapist(@AuthenticatedUser() therapist: KeycloakUserDTO) {
        return await this.therapistWorkflowService.hasLocalTherapist(therapist);
    }

    @Post('createTherapist')
    async createTherapist(
        @AuthenticatedUser() therapist: KeycloakUserDTO,
        @Body() therapistForm: TherapistFormDTO,
    ) {
        return await this.therapistWorkflowService.createTherapist(
            therapist,
            therapistForm,
        );
    }

    @Post('createPatient/:status')
    @UsePipes(ValidationPipe)
    @UseGuards(TherapistAuthGuard)
    async createPatient(
        @Param('status', new StatusTypeValidationPipe()) status: StatusType,
        @AuthenticatedUser() user: KeycloakUserDTO,
        @Body() patientDTO: LocalPatientDTO
    ) {
        await this.therapistWorkflowService.addPatientToTherapist(
            patientDTO,
            user.sub,
            status,
        );
    }

    @UseGuards(TherapistAuthGuard)
    @Get('getPatientsByStatus/:status')
    async getPatientsFromTherapist(
        @Param('status', new StatusTypeValidationPipe()) status: StatusType,
        @AuthenticatedUser() user: KeycloakUserDTO,
    ): Promise<Association[]> {
        const patients =
            await this.therapistWorkflowService.getPatientsFromTherapist(
                user.sub,
                status,
            );
        return patients;
    }

    @UseGuards(TherapistAuthGuard)
    @Get('getPatientById/:id')
    async getPatient(
        @Param('id') id: string,
        @AuthenticatedUser() user: KeycloakUserDTO,
    ): Promise<Patient> {
        const patient =
            await this.therapistWorkflowService.getPatientWithAssociation({
                patientId: id,
                therapistKeycloakId: user.sub,
            });
        return patient;
    }

    @UseGuards(TherapistAuthGuard)
    @Patch('myProfile')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    async updateMyProfile(
        @AuthenticatedUser() therapist: KeycloakUserDTO,
        @Body() dto: TherapistUpdateDTO,
    ) {
        return await this.therapistWorkflowService.updateMyProfile(therapist.sub, dto);
    }

    @UseGuards(TherapistAuthGuard)
    @Patch('updatePatient/:id/:status')
    @UsePipes(ValidationPipe)
    async updateLocalPatient(
        @Param('id') patientId: string,
        @Param('status', new StatusTypeValidationPipe(false))
        @Body() localPatientDTO: LocalPatientDTO,
        @AuthenticatedUser() user: KeycloakUserDTO,
    ) {
        await this.therapistWorkflowService.updateLocalPatient({
            patientId,
            localPatientDTO,
            therapistKeycloakId: user.sub,
        });
    }
    
    @UseGuards(TherapistAuthGuard)
    @Patch('updatePatientStatus/:id/:newStatus')
    @UsePipes(ValidationPipe)
    async updatePatientStatus(
        @Param('id') patientId: string,
        @Param('newStatus', new StatusTypeValidationPipe(false))
        newStatus: StatusType,
        @AuthenticatedUser() user: KeycloakUserDTO,
    ) {
        await this.therapistWorkflowService.updatePatientStatus({
            patientId,
            therapistKeycloakId: user.sub,
            newStatus,
        });
    }
    
    @UseGuards(TherapistAuthGuard)
    @Delete('removePatient/:id')
    async removePatient(
        @Param('id') patientId: string,
        @AuthenticatedUser() user: KeycloakUserDTO,
    ) {
        console.log('removePatient');
        await this.therapistWorkflowService.removeAssociation(
            patientId,
            user.sub,
        );
    }

    @UseGuards(TherapistAuthGuard)
    @Post('association/:associationId/comment')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    async createAssociationComment(
        @Param('associationId') associationId: string,
        @AuthenticatedUser() user: KeycloakUserDTO,
        @Body() dto: CreateTherapistCommentDto,
    ) {
        return await this.therapistWorkflowService.createAssociationComment({
            associationId,
            therapistKeycloakId: user.sub,
            dto,
        });
    }

    @UseGuards(TherapistAuthGuard)
    @Get('association/:associationId/comments')
    async listAssociationComments(
        @Param('associationId') associationId: string,
        @AuthenticatedUser() user: KeycloakUserDTO,
    ) {
        return await this.therapistWorkflowService.listAssociationComments({
            associationId,
            therapistKeycloakId: user.sub,
        });
    }

    @UseGuards(TherapistAuthGuard)
    @Patch('association/comment/:commentId')
    @UsePipes(
        new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        }),
    )
    async updateAssociationComment(
        @Param('commentId') commentId: string,
        @AuthenticatedUser() user: KeycloakUserDTO,
        @Body() dto: CreateTherapistCommentDto,
    ) {
        return await this.therapistWorkflowService.updateAssociationComment({
        commentId,
        therapistKeycloakId: user.sub, 
        dto,
        });
    }
    
    @UseGuards(TherapistAuthGuard)
    @Delete('association/comment/:commentId')
    @HttpCode(HttpStatus.NO_CONTENT) 
    async removeAssociationComment(
        @Param('commentId') commentId: string,
        @AuthenticatedUser() user: KeycloakUserDTO,
    ) {
        return await this.therapistWorkflowService.removeAssociationComment({
            commentId,
            therapistKeycloakId: user.sub,
        });
    }
}
