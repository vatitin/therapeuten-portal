import { Routes, Route } from 'react-router-dom';
import { RequireProfile } from './components/auth/RequireProfile';

import { LandingPage }       from './pages/LandingPage';
import { HomePage }              from './pages/HomePage';
import { CreatePatient }     from './components/features/Patients/CreatePatient';
import { WaitingPatientsPage } from './pages/Patients/WaitingPatientsPage';
import { ActivePatientsPage }  from './pages/Patients/ActivePatientsPage';
import { SetProfilePage }        from './pages/Profile/SetProfilePage';
import { NotFoundPage }      from './pages/NotFoundPage';
import { LandingLayout } from './layouts/LandingLaylout';
import { AppLayout } from './layouts/AppLaylout';
import { MyProfileContainer } from './pages/Profile/MyProfileContainer';
import { Profile } from './pages/Profile/ProfilePage';

export const AppRoutes = () => (
  <Routes>
      <Route
        path="/"
        element={
          <LandingLayout>
            <LandingPage />
          </LandingLayout>
        }
      />

      <Route
        element={
          <RequireProfile>
            <AppLayout /> 
          </RequireProfile>
        }
      >
      <Route path="home"                          element={<HomePage />} />
      <Route path="addNewPatient/:patientStatus"  element={<CreatePatient />} />
      <Route path="waitingPatients"               element={<WaitingPatientsPage />} />
      <Route path="activePatients"                element={<ActivePatientsPage />} />
      <Route path="myProfile"                     element={<Profile />} /> 
      <Route path="setProfile"                    element={<SetProfilePage />} />
      <Route path="myProfile"                     element={<MyProfileContainer />} />
      <Route path="*"                             element={<NotFoundPage />} />
    </Route>
  </Routes>
);
