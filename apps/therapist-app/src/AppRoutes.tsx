import { useUserStatus } from './components/hooks/useUserStatus';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Home } from './components/pages/Home';
import { CreatePatient } from './components/pages/CreatePatient';
import { Patients } from './components/pages/Patients';
import { Profile } from './components/pages/Profile';
import { PageNotFound } from './components/pages/PageNotFound';
import { SetProfile } from './components/pages/SetProfile';
import { Header } from './components/common/Header';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect } from 'react';

export const AppRoutes = () => {
  const { hasProfile } = useUserStatus();
  const location = useLocation();
  const {keycloak} = useKeycloak();
  const navigate = useNavigate();


  useEffect(() => {
    if (!hasProfile && location.pathname !== '/setProfile' && keycloak.authenticated) {
      navigate("/setProfile")
    }
  }, [hasProfile, keycloak])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addNewPatient/:patientStatus" element={<CreatePatient />} />
        <Route path="/myPatients/:patientStatus" element={<Patients />} />
        <Route path="/myProfile" element={<Profile />} />
        <Route path="/setProfile" element={<SetProfile />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};
