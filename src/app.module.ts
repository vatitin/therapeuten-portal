import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Patient } from './therapist/entity/Patient.entity';
import { PatientTherapist } from './therapist/entity/PatientTherapist.entity';
import { Therapist } from './therapist/entity/Therapist.entity';
import { TherapistModule } from './therapist/therapist.module';

@Module({
    imports: [
        TherapistModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'myuser',
            password: 'myuserpassword',
            database: 'mydatabase',
            entities: [Therapist, Patient, PatientTherapist],
            //todo set this to false before production
            synchronize: true,
        }),
        AuthModule.forRoot({
            //connectionURI: 'https://try.supertokens.com',
            connectionURI:
                'https://st-dev-6e70f420-979d-11ee-9cd1-2f6e5d2f828b.aws.supertokens.io',
            apiKey: '8x9MINFlDJn4FO0T8O2PP-fYPj',
            appInfo: {
                // Learn more about this on https://supertokens.com/docs/emailpassword/appinfo
                appName: 'Queue app',
                apiDomain: 'http://localhost:3001',
                websiteDomain: 'http://localhost:3000',
                apiBasePath: '/auth',
                websiteBasePath: '/auth',
            },
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
