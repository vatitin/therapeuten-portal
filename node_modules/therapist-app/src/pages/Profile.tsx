import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { therapistProfile } from '../endpoints';
//import AuthService from '../../../../packages/services/AuthService';
import apiClient from '../APIService';

function Profile() {
  const navigate = useNavigate();

  const userId = "tempUserId"; // todo Replace with actual user ID retrieval logic
  
  interface Therapist {
    family_name?: string;
    given_name?: string;
    email?: string;
  }

  const [therapist, setTherapist] = useState<Therapist>({});

  useEffect(() => {
    try {
      apiClient.get(therapistProfile).then((response) => {
        setTherapist(response.data);
      });
    } catch (error) {
      console.error(error);
    }
  }, [userId, navigate]);

  return (
    <div>
      <div>{therapist.family_name ? therapist.family_name : '-'}</div>
      <div>{therapist.given_name ? therapist.given_name : '-'}</div>
      <div>{therapist.email}</div>
    </div>
  );
}

export { Profile };
