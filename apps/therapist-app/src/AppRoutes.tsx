import { Routes, Route } from 'react-router-dom';
import { RequireProfile } from './components/auth/RequireProfile';

import { LandingPage }       from './components/pages/LandingPage';
import { Home }              from './components/pages/Home';
import { CreatePatient }     from './components/pages/CreatePatient';
import { WaitingPatientsPage } from './components/pages/patients/WaitingPatientsPage';
import { ActivePatientsPage }  from './components/pages/patients/ActivePatientsPage';
import { Profile }           from './components/pages/Profile';
import { SetProfile }        from './components/pages/SetProfile';
import { PageNotFound }      from './components/pages/PageNotFound';
import { LandingLayout } from './components/layouts/LandingLaylout';
import { AppLayout } from './components/layouts/AppLaylout';
import { MyProfileContainer } from './components/pages/MyProfileContainer';

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
      <Route path="home"                      element={<Home />} />
      <Route path="addNewPatient/:patientStatus" element={<CreatePatient />} />
      <Route path="waitingPatients"           element={<WaitingPatientsPage />} />
      <Route path="activePatients"            element={<ActivePatientsPage />} />
      {/* <Route path="myProfile"                 element={<Profile />} /> */}
      <Route path="setProfile"                element={<SetProfile />} />
      <Route path="myProfile"                element={<MyProfileContainer />} />
      <Route path="*"                         element={<PageNotFound />} />
    </Route>
  </Routes>
);
