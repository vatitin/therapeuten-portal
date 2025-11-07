import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import createApiClient from '../components/APIService';
import type { PatientType } from '../types/patient.types';


export function usePatient() {
  const { keycloak, initialized } = useKeycloak();

  const [patient, setPatient]   = useState<PatientType | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState<Error | null>(null);

  useEffect(() => {
    if (!initialized) return;         
    if (!keycloak.authenticated) {  
      setPatient(null);
      return;
    }

    const abort = new AbortController();
    const fetchPatient = async () => {
      setLoading(true);
      setError(null);

      try {
        const api = createApiClient(keycloak.token);
        const { data } = await api.get<PatientType>(
          `http://localhost:3001/patient/getProfile`,
          { signal: abort.signal }
        );
        setPatient(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err as Error);
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();

    return () => abort.abort();
  }, [initialized, keycloak.authenticated, keycloak.token]);

  return { patient, loading, error };
}
