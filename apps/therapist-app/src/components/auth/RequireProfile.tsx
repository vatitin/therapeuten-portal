import { type ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStatus } from "../hooks/useUserStatus";
import { useKeycloak } from "@react-keycloak/web";
import { Loader } from '@mantine/core';

interface RequireProfileProps {
  children: ReactNode;
}

export function RequireProfile({ children }: RequireProfileProps) {
  const { hasProfile, loading } = useUserStatus();
  const { keycloak } = useKeycloak();
  const location = useLocation();
  const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        console.log("Checking user profile status:", {
            loading,
            hasProfile,
            location,
            keycloak,
        });
        if (!keycloak.authenticated) {
            console.log("User not authenticated, redirecting to login");
            keycloak.login({ redirectUri: window.location.href });
            return;
        }
        if (
            !hasProfile &&
            location.pathname !== "/setProfile"
        ) {
            navigate("/setProfile", { replace: true });
        }
    }, [loading, hasProfile, location.pathname, keycloak.authenticated]);

    if (loading) {
        return <Loader />;
    }

    return <>{children}</>;
}
