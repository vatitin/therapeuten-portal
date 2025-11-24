import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import createApiClient from '../api/APIService';

export function useUserStatus() {
  const { keycloak, initialized } = useKeycloak();
  const [hasProfile, setHasProfile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (!initialized) return;        
    if (!keycloak.authenticated) {
      setHasProfile(undefined);                     
      return;
    }

  (async () => {
    try {
      const api = createApiClient(keycloak.token);
      const { data } = await api.get(
        'http://localhost:3001/patient/hasLocalPatient'
      );
      console.log("set hasProfile", data)
      setHasProfile(data);
    } catch {
      setHasProfile(false);
    } 
  })();
  }, [initialized, keycloak.authenticated, keycloak.token, hasProfile]);

  return { hasProfile };
}
