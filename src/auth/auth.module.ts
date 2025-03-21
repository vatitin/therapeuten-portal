import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/therapist/entity/Patient.entity';
import { PatientTherapist } from 'src/therapist/entity/PatientTherapist.entity';
import { Therapist } from 'src/therapist/entity/Therapist.entity';
import { TherapistService } from 'src/therapist/services/therapist/therapist.service';
import {
  KeycloakConnectModule,
  AuthGuard,
  RoleGuard,
  TokenValidation,
  PolicyEnforcementMode,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

@Module({
  imports: [
    //todo set appropriate token lifetime regarding Offline token validation
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8080',
      realm: 'patient-therapist-platform',
      clientId: 'backend-client',
      secret: clientSecret ?? '',
      //todo change permissive to sth else 
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      //todo maybe user ONLINE, needs to be checked
      tokenValidation: TokenValidation.OFFLINE,
    }),
    TypeOrmModule.forFeature([Patient, Therapist, PatientTherapist]),
  ],
  providers: [
    TherapistService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  exports: [KeycloakConnectModule],
  controllers: [],
})
export class AuthModule {}
