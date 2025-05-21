import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import createApiClient from '../APIService';
import { hasLocalTherapist } from '../endpoints';

export const useUserStatus = () => {
    const { keycloak, initialized } = useKeycloak();
    const [statusChecked, setStatusChecked] = useState(false);
    const [hasProfile, setHasProfile] = useState(false);

    useEffect(() => {
    const fetchStatus = async () => {
        if (!initialized) {
            return;
        }
        if (!keycloak.authenticated) {
            keycloak.login();
        }
        if (!hasProfile) {
            try {
                const apiClient = createApiClient(keycloak?.token ?? "");
                const result = await apiClient.get(hasLocalTherapist);
                if (!result.data) {
                    return;
                } else {
                    setHasProfile(true);
                }
            } catch (err) {
                console.error('Failed to fetch user status', err);
            } finally {
                setStatusChecked(true);
            }
        }
    };

    fetchStatus();
    }, [keycloak.authenticated, initialized, hasProfile, statusChecked]);

    return { hasProfile, statusChecked };
};
