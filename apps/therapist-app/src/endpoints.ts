const BASE_URL = 'http://localhost:3001';
const THERAPIST_URL = `${BASE_URL}/therapist`;

export const therapistProfile = `${BASE_URL}/therapist/myProfile`;

export const patientById = (id: string) => `${THERAPIST_URL}/getPatientById/${id}`;

export const patientsWithStatus = (status: string) =>
  `${THERAPIST_URL}/getPatientsByStatus/${status}`;

export const deletePatientWithId = (id: string) =>
  `${THERAPIST_URL}/removePatient/${id}`;

export const updatePatient = (id: string, status: string) =>
  `${THERAPIST_URL}/updatePatient/${id}/${status}`;

export const addPatientWithStatus = (status: string) =>
  `${THERAPIST_URL}/createPatient/${status}`;

export const createTherapist = `${THERAPIST_URL}/createTherapist`;

export const hasLocalTherapist =`${THERAPIST_URL}/hasLocalTherapist`;