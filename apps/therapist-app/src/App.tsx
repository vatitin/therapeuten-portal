import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './pages/Navbar';
import { Home } from './pages/Home';
import CreatePatient from './pages/CreatePatient';
import { Patient } from './pages/Patient';
import { MyPatients } from './pages/MyPatients';
import { Profile } from './pages/Profile';
import { PageNotFound } from './pages/PageNotFound';

function App() {

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/addNewPatient/:patientStatus"
            element={<CreatePatient />}
          />
          <Route path="/patient/:id" element={<Patient />} />
          <Route path="/myPatients/:patientStatus" element={<MyPatients />} />
          <Route path="/myProfile" element={<Profile />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
