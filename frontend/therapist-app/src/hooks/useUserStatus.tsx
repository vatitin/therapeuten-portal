import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import createApiClient from '../api/APIService';
import { hasLocalTherapist } from '../api/endpoints';

interface UserStatus {
  hasProfile: boolean;
  loading: boolean;
}

export const useUserStatus = (): UserStatus => {
  const { keycloak, initialized } = useKeycloak();
  const [state, setState] = useState<UserStatus>({
    hasProfile: false,
    loading: true,
  });

  useEffect(() => {
    if (!initialized) return;

    if (!keycloak.authenticated) {
      setState({ hasProfile: false, loading: false });
      return;
    }

    const fetchProfileStatus = async () => {
      try {
        const apiClient = createApiClient(keycloak.token ?? '');
        const response = await apiClient.get<{ data: boolean }>(hasLocalTherapist);

        setState({
          hasProfile: Boolean(response.data),
          loading: false,
        });
      } catch (error) {
        console.error('Failed to fetch user status:', error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    fetchProfileStatus();
  }, [
    initialized, 
    keycloak.authenticated, 
    keycloak.token,
  ]);

  return state;
};
