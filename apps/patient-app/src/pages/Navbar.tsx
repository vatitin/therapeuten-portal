import { Link } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web'

function GuestNavbar({ onLoginPatient }: { onLoginPatient: () => void; }) {
  return (  
    <>
      <li className="nav-item">
        <Link 
          onClick={(e) => {
            e.preventDefault();
            onLoginPatient();
          }}
          to="/"
          className="nav-link active"
          aria-current="page"
        >
          Login
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="http://localhost:5173/"
          className="nav-link active"
          aria-current="page"
        >
          Therapeuten-Anmeldung
        </Link>
      </li>
    </>
  )
 }

function PatientNavbar({ email, onLogout }: { email: string; onLogout: () => void }) {
  return (
    <>
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

            {!initialized || !keycloak.authenticated && (
              <GuestNavbar
                onLoginPatient={() => keycloak.login()}
              />
            )}

            {initialized && keycloak.authenticated && keycloak.clientId === "patient-client" && (
              <PatientNavbar
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
