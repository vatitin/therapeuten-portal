import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import createApiClient from '../api/APIService';
import type { TherapistType } from '../types/therapist.type';
import axios from 'axios';


export function useTherapist() {
  const { keycloak, initialized } = useKeycloak();

  const [data, setData]         = useState<TherapistType | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState<Error | null>(null);

  useEffect(() => {
    if (!initialized) return;         
    if (!keycloak.authenticated) {  
      setData(null);
      return;
    }

    const abort = new AbortController();
    const fetchTherapist = async () => {
      setLoading(true);
      setError(null);

      try {
        const api = createApiClient(keycloak.token);
        const { data } = await api.get<TherapistType>(
          `http://localhost:3001/therapist/myProfile`,
          { signal: abort.signal }
        );
        console.log("data", data)
        setData(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        if (axios.isCancel(err)) return;
        setError(err as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();

    return () => abort.abort();
  }, [initialized, keycloak.authenticated]);

  return { data, loading, error };
}
