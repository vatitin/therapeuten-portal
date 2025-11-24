import { useEffect, useState } from 'react';
import createApiClient from '../api/APIService';
import { patientsWithStatus } from '../api/endpoints';
import type { AssociationType } from '../types/association.type';

export function useAssociations(status: string, token: string | null) {

  const [assocs, setAssocs] = useState<AssociationType[]>([]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const api = createApiClient(token);
      const res = await api.get<AssociationType[]>(patientsWithStatus(status));
      if (res.status === 200) setAssocs(res.data);
    })();
  }, [status, token]);
  
  return assocs;
}