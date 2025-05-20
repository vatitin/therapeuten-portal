import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatusType } from '../constants';
import { PatientRow } from './PatientRow';
import { HttpStatusCode } from 'axios';
import createApiClient from '../APIService';
import { deletePatientWithId, patientsWithStatus, updatePatient } from '../endpoints';
import type { PatientType } from '../types/patient.types';
import { useKeycloak } from '@react-keycloak/web'

//todo check types of id, event and so on and how to handle the id nnumber check since it is checked multiple times
//todo check patientStatus={patientStatus ?? ''}
function MyPatients() {
  const { patientStatus } = useParams();
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();
  const apiClient = createApiClient('');

  useEffect(() => {
    if (patientStatus !== StatusType.WAITING && patientStatus !== StatusType.ACTIVE) {
      return navigate('*');
    }

    if (!initialized || !keycloak.authenticated || !keycloak.token) return;

    const apiClient = createApiClient(keycloak.token ?? "");

    const loadPatients = async () => {
      try {
        const response = await apiClient.get(patientsWithStatus(patientStatus));
        console.log("response:  " + response);
        setPatients(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadPatients();
  }, [navigate, patientStatus, initialized]);

  const handleRemovePatient = async (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!id || !Number.isInteger(Number(id))) {
      console.warn('No ID provided');
      return;
    }
    const result = await apiClient.delete(deletePatientWithId(Number(id)));
    if (result.status === HttpStatusCode.Ok) {
      setPatients((prevPatients) => prevPatients.filter((patient: PatientType) => patient.id !== id));
    }
  };

  const handleUpdatePatientStatus = async (id: string, status: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!id || !Number.isInteger(Number(id))) {
      console.warn('No ID provided');
      return;
    }
    const result = await apiClient.patch(updatePatient(Number(id), status));
    if (result.status === HttpStatusCode.Ok) {
      setPatients((prevPatients) => prevPatients.filter((patient: PatientType) => patient.id !== id));
    }
  };

  const headLine = (patientStatus === StatusType.WAITING) ? 'Meine Warteliste' : 'Meine Patienten';

  return (
    <div className="container">
      <h1 className="text-center mb-5 mt-3">{headLine}</h1>
      <table className="table table-striped table-hover">
        <thead className="table-light">
          <tr>
            <th>Nr:</th>
            <th scope="col">Nachname</th>
            <th scope="col">Vorname</th>
            <th scope="col">Email</th>
            <th scope="col">Handynummer</th>
            <th scope="col">Geschlecht</th>
            <th scope="col">Statusänderung</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient: PatientType, index) => (
            <PatientRow
              key={patient.id}
              patient={{ ...patient, sequence: index + 1 }}
              patientStatus={patientStatus ?? ''}
              onRemove={handleRemovePatient}
              onUpdate={handleUpdatePatientStatus}
            />
          ))}
        </tbody>
      </table>
      <div className="d-grid gap-2 mb-3 col-6 mx-auto" onClick={() => navigate(`/addNewPatient/${patientStatus}`)}>
        <button className="btn btn-primary btn-secondary" type="button">
          Patient hinzufügen
        </button>
      </div>
    </div>
  );
}

export { MyPatients };
