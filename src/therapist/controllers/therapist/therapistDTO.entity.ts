import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class TherapistDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(10)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
