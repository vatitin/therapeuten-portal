// AppRoutes.tsx
import { useUserStatus } from './components/hooks/useUserStatus';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Home } from './components/pages/Home';
import { CreatePatient } from './components/pages/CreatePatient';
import { Patient } from './components/pages/Patient';
import { MyPatients } from './components/pages/MyPatients';
import { Profile } from './components/pages/Profile';
import { PageNotFound } from './components/pages/PageNotFound';
import { SetProfile } from './components/pages/SetProfile';
import { useEffect } from 'react';
import { Header } from './components/common/Header';

export const AppRoutes = () => {
  const { hasProfile, statusChecked } = useUserStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if(!statusChecked) {
      return;
    }
    if (!hasProfile) {
      navigate('/setProfile');
    }
  }, [statusChecked, hasProfile]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addNewPatient/:patientStatus" element={<CreatePatient />} />
        <Route path="/patient/:id" element={<Patient />} />
        <Route path="/myPatients/:patientStatus" element={<MyPatients />} />
        <Route path="/myProfile" element={<Profile />} />
        <Route path="/setProfile" element={<SetProfile />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};
