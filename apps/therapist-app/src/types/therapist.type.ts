export interface TherapistType {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
}