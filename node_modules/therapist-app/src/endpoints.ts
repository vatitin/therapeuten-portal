const BASE_URL = 'http://localhost:3001';
const THERAPIST_PATIENTS_URL = `${BASE_URL}/therapist/patients`;
const THERAPIST_URL = `${BASE_URL}/therapist`;

export const therapistProfile = `${BASE_URL}/therapist/myProfile`;

export const patientById = (id: number) => `${THERAPIST_PATIENTS_URL}/byId/${id}`;

export const patientsWithStatus = (status: string) =>
  `${THERAPIST_PATIENTS_URL}/${status}`;

export const deletePatientWithId = (id: number) =>
  `${THERAPIST_URL}/removePatient/${id}`;

export const updatePatient = (id: number, status: string) =>
  `${THERAPIST_URL}/updatePatient/${id}/${status}`;

export const addPatientWithStatus = (status: string) =>
  `${THERAPIST_URL}/createPatient/${status}`;

export const setTherapistData = `${THERAPIST_URL}/setData`;

export const hasLocalTherapist =`${THERAPIST_URL}/hasLocalTherapist`;