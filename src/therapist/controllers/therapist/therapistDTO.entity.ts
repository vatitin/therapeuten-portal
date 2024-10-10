import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class TherapistDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string | undefined;
}
