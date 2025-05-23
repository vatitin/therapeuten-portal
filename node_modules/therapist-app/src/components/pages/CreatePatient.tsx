import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addPatientWithStatus } from '../../endpoints';
import createApiClient from '../../APIService';
import { useKeycloak } from '@react-keycloak/web';

function CreatePatient() {
  const { patientStatus } = useParams();
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    phoneNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!patientStatus) {
        console.error('No patient status provided');
        return;
      }
      const apiClient = createApiClient(keycloak.token ?? "");
      await apiClient.post(addPatientWithStatus(patientStatus), formData);
      navigate(`/myPatients/${patientStatus}`);
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            Vorname
          </label>
          <input
            className="form-control"
            id="firstName"
            name="firstName"
            placeholder="Max"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Nachname
          </label>
          <input
            className="form-control"
            id="lastName"
            name="lastName"
            placeholder="Mustermann"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email">Email</label>
          <input
            className="form-control"
            id="email"
            name="email"
            placeholder="meine@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phoneNumber">Handynummer</label>
          <input
            className="form-control"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="d-block">Geschlecht:</label>

          <input
            type="radio"
            className="btn-check"
            id="genderM"
            name="gender"
            value="M"
            autoComplete="off"
            onChange={handleChange}
          />
          <label className="btn btn-outline-secondary" htmlFor="genderM">
            Männlich
          </label>

          <input
            type="radio"
            className="btn-check"
            id="genderW"
            name="gender"
            value="W"
            autoComplete="off"
            onChange={handleChange}
          />
          <label className="btn btn-outline-secondary" htmlFor="genderW">
            Weiblich
          </label>

          <input
            type="radio"
            className="btn-check"
            id="genderD"
            name="gender"
            value="D"
            autoComplete="off"
            onChange={handleChange}
          />
          <label className="btn btn-outline-secondary" htmlFor="genderD">
            Divers
          </label>
        </div>

        <button type="submit">Hinzufügen</button>
      </form>
    </div>
  );
}

export { CreatePatient };
