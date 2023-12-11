import {
  MiddlewareConsumer,
  Module,
  NestModule,
  DynamicModule,
} from '@nestjs/common';

import { AuthMiddleware } from './auth/auth.middleware';
import { ConfigInjectionToken, AuthModuleConfig } from './config.interface';
import { SupertokensService } from './supertokens/supertokens.service';
import { TherapistService } from 'src/therapist/services/therapist/therapist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/therapist/entity/Patient.entity';
import { Therapist } from 'src/therapist/entity/Therapist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Therapist])],
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
