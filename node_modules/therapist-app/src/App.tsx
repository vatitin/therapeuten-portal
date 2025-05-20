import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import CreatePatient from './components/CreatePatient';
import { Patient } from './components/Patient';
import { MyPatients } from './components/MyPatients';
import { Profile } from './components/Profile';
import { PageNotFound } from './components/PageNotFound';

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
