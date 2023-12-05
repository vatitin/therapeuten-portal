import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TherapistDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  id: number;
}
