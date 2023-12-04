import { Controller, Get } from '@nestjs/common';
import { TherapistService } from '../../services/therapist/therapist.service'

@Controller('therapist')
export class TherapistController {
  constructor(private therapistService: TherapistService) {}
  @Get('myProfile')
  getTherapist() {
    return {
      email: 'a@email',
    };
  }
}
