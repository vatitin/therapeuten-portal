import { IsEmail, IsNumber, IsString } from 'class-validator';
import { GenderType } from 'src/therapist/entity/Patient.entity';

export class PatientDTO {
  @IsEmail()
  //@IsNotEmpty()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  gender: GenderType;

  @IsNumber()
  id: number;
}
