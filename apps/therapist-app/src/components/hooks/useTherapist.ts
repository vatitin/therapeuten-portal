import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import createApiClient from '../../APIService';
import type { TherapistType } from '../../types/therapist.type';


export function useTherapist() {
  const { keycloak, initialized } = useKeycloak();

  const [therapist, setTherapist]   = useState<TherapistType | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState<Error | null>(null);

  useEffect(() => {
    if (!initialized) return;         
    if (!keycloak.authenticated) {  
      setTherapist(null);
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
        setTherapist(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err as Error);
        setTherapist(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();

    return () => abort.abort();
  }, [initialized, keycloak.authenticated, keycloak.token]);

  return { therapist, loading, error };
}
