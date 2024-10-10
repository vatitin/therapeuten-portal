import { IsEmail, IsNotEmpty } from 'class-validator';

export class TherapistDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string | undefined;
}
