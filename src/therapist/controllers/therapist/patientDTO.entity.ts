import { IsOptional, IsString } from 'class-validator';
import { GenderType } from 'src/therapist/entity/Patient.entity';

export class PatientDTO {
  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  gender: GenderType;
}
