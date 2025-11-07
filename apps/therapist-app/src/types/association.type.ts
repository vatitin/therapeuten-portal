import type { PatientType } from "./patient.types";
import type { TherapistType } from "./therapist.type";

export interface AssociationType {
  id: string;
  patient: PatientType;
  therapist: TherapistType;
  comment?: string;
  applicationText?: string;
  status: string;
}