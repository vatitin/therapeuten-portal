import { Module } from '@nestjs/common';
import { TherapistModule } from './therapist/therapist.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Therapist } from './therapist/entity/Therapist.entity';

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
      entities: [Therapist],
      //todo set this to fale before production
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
