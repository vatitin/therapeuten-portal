import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from 'nest-keycloak-connect';
import { TherapistCRUDService } from '../domain/therapist.crud.service';

@Injectable()
export class TherapistAuthGuard implements CanActivate {
    constructor(
        private readonly keycloakGuard: AuthGuard,
        private readonly therapistCrud: TherapistCRUDService,
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {

        const allowed = (await this.keycloakGuard.canActivate(ctx)) as boolean;
        if (!allowed) {
            throw new ForbiddenException('Not authenticated');
        }

        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        const realmRoles = user.realm_access?.roles || [];
        if (!realmRoles.includes('role_therapist')) {
            throw new ForbiddenException('User is missing role_therapist');
        }

        const therapist = await this.therapistCrud.getTherapistByKeycloakId(user.sub);
        if (!therapist) {
            throw new NotFoundException(`No therapist found for ${user.sub}`);
        }

        return true;
    }
}
