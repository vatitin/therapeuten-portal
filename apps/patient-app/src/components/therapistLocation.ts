export interface TherapistLocation {
  therapistId: string;
  location: {
    coordinates: [number, number];
    type: string;
  };
}