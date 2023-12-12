import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { StatusType } from 'src/therapist/entity/Patient.entity';

@Injectable()
export class StatusTypeValidationPipe
  implements PipeTransform<string, StatusType>
{
  transform(value: string): StatusType {
    if (!(value === 'A' || value === 'W' || value === 'F')) {
      throw new BadRequestException('Invalid status type');
    }

    return value as StatusType;
  }
}
