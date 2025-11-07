export interface TherapistDTO {
    id: string,   
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    location: {
        coordinates: [number, number];
        type: string;
    };
}