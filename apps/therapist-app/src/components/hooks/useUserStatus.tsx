import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import createApiClient from '../../APIService';
import { hasLocalTherapist } from '../../endpoints';

export const useUserStatus = () => {
    const { keycloak, initialized } = useKeycloak();
    const [hasProfile, setHasProfile] = useState(false);

    useEffect(() => {
    const fetchStatus = async () => {
        if (!initialized) {
            return;
        }
        if (!keycloak.authenticated) {
            console.log("User is not authenticated");
            return;
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
            } 
        }
    };

    fetchStatus();
    }, [keycloak.authenticated, initialized, hasProfile, keycloak?.token]);

    return { hasProfile };
};
