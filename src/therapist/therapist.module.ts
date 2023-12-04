import { Module } from '@nestjs/common';
import { TherapistController } from './controllers/therapist/therapist.controller';
import { TherapistService } from './services/therapist/therapist.service';

@Module({
  controllers: [TherapistController],
  providers: [TherapistService],
})
export class TherapistModule {}
