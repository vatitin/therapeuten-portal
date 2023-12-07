import { Module } from '@nestjs/common';
import { TherapistModule } from './therapist/therapist.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Therapist } from './therapist/entity/Therapist.entity';
import { Patient } from './therapist/entity/Patient.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TherapistModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'myuser',
      password: 'myuserpassword',
      database: 'mydatabase',
      entities: [Therapist, Patient],
      //todo set this to fale before production
      synchronize: true,
    }),
    AuthModule.forRoot({
      // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
      connectionURI: 'https://try.supertokens.com',
      // apiKey: <API_KEY(if configured)>,
      appInfo: {
        // Learn more about this on https://supertokens.com/docs/emailpassword/appinfo
        appName: 'My queue app',
        apiDomain: 'http://localhost:3000',
        websiteDomain: 'http://localhost:3001',
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
