import { useUserStatus } from "./hooks/useUserStatus";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import '@mantine/core/styles.css';
import { SearchMapPage } from "./components/SearchMapPage";
import { SetProfile } from "./components/SetProfile";
import { ApplyForTherapist } from "./components/ApplyForTherapist";
import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";

export function AppRoutes() {

    const { hasProfile } = useUserStatus();
    const location = useLocation();
    const {keycloak} = useKeycloak();
    const navigate = useNavigate();

    useEffect(() => {
        if (hasProfile === undefined) return;
        if (!hasProfile && location.pathname !== '/setProfile' && keycloak.authenticated) {
            navigate("/setProfile");
        }
    }, [hasProfile, keycloak])

        
    return (
        <Routes>
            <Route path="/" element={<SearchMapPage />} />
            <Route path="/setProfile" element={<SetProfile />} />
            <Route path="/therapist/:id" element={<ApplyForTherapist />} />
        </Routes>
    );
}