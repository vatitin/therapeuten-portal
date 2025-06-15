import { useUserStatus } from "./hooks/useUserStatus";
import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import '@mantine/core/styles.css';
import { SearchMapPage } from "./components/SearchMapPage";
import { SetProfile } from "./components/SetProfile";
import { ApplyForTherapist } from "./components/ApplyForTherapist";

export function AppRoutes() {

    const { hasProfile, statusChecked } = useUserStatus();
    const location = useLocation();

    if (!statusChecked) return null;

    if (!hasProfile && location.pathname !== '/setProfile') {
        return <Navigate to="/setProfile" replace />;
    }
    
  return (

        <Routes>
            <Route path="/setProfile" element={<SetProfile />} />
            <Route path="/" element={<SearchMapPage />} />
            <Route path="/therapist/:id" element={<ApplyForTherapist />} />
        </Routes>
    
  );
}