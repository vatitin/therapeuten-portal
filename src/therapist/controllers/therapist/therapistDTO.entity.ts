import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class TherapistDTO {
    @IsUUID()
    @IsNotEmpty()
    KeycloakId: string;
}
