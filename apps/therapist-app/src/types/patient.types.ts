export interface PatientType {
  id: string;
  keycloakId?: string;
  sequence?: number;
  lastName?: string;
  firstName?: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
}