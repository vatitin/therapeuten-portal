import {
    DynamicModule,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/therapist/entity/Patient.entity';
import { PatientTherapist } from 'src/therapist/entity/PatientTherapist.entity';
import { Therapist } from 'src/therapist/entity/Therapist.entity';
import { TherapistService } from 'src/therapist/services/therapist/therapist.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthModuleConfig, ConfigInjectionToken } from './config.interface';
import { SupertokensService } from './supertokens/supertokens.service';

@Module({
    imports: [TypeOrmModule.forFeature([Patient, Therapist, PatientTherapist])],
    providers: [SupertokensService, TherapistService],
    exports: [],
    controllers: [],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('*');
    }

    static forRoot({
        connectionURI,
        apiKey,
        appInfo,
    }: AuthModuleConfig): DynamicModule {
        return {
            providers: [
                {
                    useValue: {
                        appInfo,
                        connectionURI,
                        apiKey,
                    },
                    provide: ConfigInjectionToken,
                },
                SupertokensService,
            ],
            exports: [],
            imports: [],
            module: AuthModule,
        };
    }
}
