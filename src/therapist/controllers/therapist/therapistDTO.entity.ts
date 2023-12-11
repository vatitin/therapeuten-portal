import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class TherapistDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string | undefined;

  @IsNotEmpty()
  @IsUUID()
  superTokensUserId: string;

  /*
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
  */
}
