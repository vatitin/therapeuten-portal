import { Link } from 'react-router-dom';
import { AppRoutes } from '../constants';
import { useKeycloak } from '@react-keycloak/web'


// todo check what loginPatient: any does? what type does it have?
function GuestNavbar({ onLoginTherapist }: { onLoginTherapist: () => void }) {
  
  return (  
    <>
      <li className="nav-item">
        <Link 
          to="http://localhost:5173/"
          className="nav-link active"
          aria-current="page"
        >
          Login
        </Link>
      </li>
      <li className="nav-item">
        <Link
          onClick={(e) => {
            e.preventDefault();
            onLoginTherapist();
          }}
          to="/"
          className="nav-link active"
          aria-current="page"
        >
          Therapeuten-Anmeldung
        </Link>
      </li>
    </>
  )
 }

// todo use in patient-app
// function PatientNavbar({ email, onLogout }) {
//   return (
//     <>
//     <li className="nav-item">
//       <button
//         type="submit"
//         onClick={onLogout}
//         className="nav-link btn btn-link"
//       >
//         Logout
//       </button>
//     </li>
//     <li className="nav-item">
//       <Link
//         to="/myProfile"
//         className="nav-link active"
//         aria-current="page"
//       >
//         {email}
//       </Link>
//     </li>
//   </>
//   )
//  }


function TherapistNavbar({ email, onLogout }: { email: string; onLogout: () => void }) { 
  return (
    <>
    <li className="nav-item">
      <Link
        to={AppRoutes.myWaitingPatients}
        className="nav-link active"
        aria-current="page"
      >
        Warteliste
      </Link>
    </li>
    <li className="nav-item">
      <Link
        to={AppRoutes.myActivePatients}
        className="nav-link active"
        aria-current="page"
      >
        Patienten
      </Link>
    </li>

    <li className="nav-item">
      <button
        type="submit"
        onClick={onLogout}
        className="nav-link btn btn-link"
      >
        Logout
      </button>
    </li>
    <li className="nav-item">
      <Link
        to="/myProfile"
        className="nav-link active"
        aria-current="page"
      >
        {email}
      </Link>
    </li>
  </>
  )
 }

const Navbar = () => {

  const { keycloak, initialized } = useKeycloak();

  //todo use right login for patient and therapist

  console.log("client: " + keycloak.clientId);

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link active" aria-current="page">
                Home
              </Link>
            </li>

            {initialized && !keycloak.authenticated && (
              <GuestNavbar
                onLoginTherapist={() => keycloak.login()} 
              />
            )}

            {initialized && keycloak.authenticated && keycloak.clientId === "therapist-client" && (
              <TherapistNavbar
                email={keycloak.tokenParsed?.email || "Therapist"}
                onLogout={() => keycloak.logout()}
              />
            )}

          </ul>
          <ul className="navbar-nav ms-auto">
          </ul>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
