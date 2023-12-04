import { Module } from '@nestjs/common';
import { TherapistModule } from './therapist/therapist.module';


@Module({
  imports: [TherapistModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
