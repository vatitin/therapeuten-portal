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
        if(!loading) return;
        console.log("Checking user profile status:", {
            hasProfile,
            location,
            keycloak,
        });
        if (
            !loading &&
            keycloak.authenticated &&
            !hasProfile &&
            location.pathname !== "/setProfile"
        ) {
            navigate("/setProfile", { replace: true });
        }
    }, [keycloak.authenticated, hasProfile, location.pathname, navigate]);

    if (loading) {
        return <Loader />;
    }

    return <>{children}</>;
}
