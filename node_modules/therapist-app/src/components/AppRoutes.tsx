// AppRoutes.tsx
import { useUserStatus } from './useUserStatus';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Home } from './Home';
import CreatePatient from './CreatePatient';
import { Patient } from './Patient';
import { MyPatients } from './MyPatients';
import { Profile } from './Profile';
import { PageNotFound } from './PageNotFound';
import { SetProfile } from './SetProfile';
import { useEffect } from 'react';

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
      <Navbar />
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
