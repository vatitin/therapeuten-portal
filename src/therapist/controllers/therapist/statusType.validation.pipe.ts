import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { StatusType } from 'src/therapist/entity/PatientTherapist.entity';

@Injectable()
export class StatusTypeValidationPipe
    implements PipeTransform<string, StatusType | undefined>
{
    constructor(private readonly isRequired: boolean = true) {}

    transform(value: string | undefined): StatusType | undefined {
        if (!value && !this.isRequired) {
            return undefined;
        }

        if (
            !(
                value === StatusType.Active ||
                value === StatusType.Waiting ||
                value === StatusType.Inactive
            )
        ) {
            throw new BadRequestException('Invalid status type');
        }

        return value as StatusType;
    }
}
