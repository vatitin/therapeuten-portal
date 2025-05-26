import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { patientById } from '../../endpoints';
import createApiClient from '../../APIService';
import type { PatientType } from '../../types/patient.types';
import keycloak from '../../keycloak';

function Patient() {
  const { id } = useParams();
  const [patientObject, setPatientObject] = useState<PatientType | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!id) {
        console.warn('No ID provided');
        return;
      }
      //todo check if keycloak is initialized and authenticated
      const apiClient = createApiClient(keycloak?.token ?? "");
      const response = await apiClient.get(patientById(id))
      setPatientObject(response.data) 
    }

    fetchPatients();
  }, [id]);

  return (
    <div>
      <div>{patientObject?.lastName ? patientObject.lastName : '-'}</div>
      <div>{patientObject?.firstName ? patientObject.firstName : '-'}</div>
      <div>{patientObject?.email ? patientObject.email : '-'}</div>
      <div>{patientObject?.phoneNumber ? patientObject.phoneNumber : '-'}</div>
      <div>{patientObject?.gender ? patientObject.gender : '-'}</div>
    </div>
  );
}

export { Patient };
