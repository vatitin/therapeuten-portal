import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { patientById } from '../endpoints';
import apiClient from '../APIService';
import type { PatientType } from '../types/patient.types';

function Patient() {
  const { id } = useParams();
  const [patientObject, setPatientObject] = useState<PatientType | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!id || !Number.isInteger(Number(id))) {
        console.warn('No ID provided');
        return;
      }
      const response = await apiClient.get(patientById(Number(id)))
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
