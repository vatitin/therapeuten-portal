import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { therapistProfile } from '../endpoints';
import { AppRoutes } from '../constants';
import KeycloakPatientService from '../services/KeycloakPatientService';
import apiClient from '../services/APIService';
import AuthService from '../services/AuthService';
import { useAuth } from '../hooks/useAuth';


function GuestNavbar({ onLoginPatient, onLoginTherapist }) { 
  return (  
    <>
      <li className="nav-item">
        <Link 
          onClick={onLoginPatient}
          to="/"
          className="nav-link active"
          aria-current="page"
        >
          Login
        </Link>
      </li>
      <li className="nav-item">
        <Link
          onClick={onLoginTherapist}
          to="/auth"
          className="nav-link active"
          aria-current="page"
        >
          Therapeuten-Anmeldung
        </Link>
      </li>
    </>
  )
 }

function PatientNavbar({ email, onLogout }) {
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


function TherapistNavbar({ email, onLogout}) { 
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

  const {
    ready,
    role,
    email,
    loginPatient,
    loginTherapist,
    logout
  } = useAuth();

  if(!ready) return null;

  console.log("role: " + role)

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

            { role === 'guest' && <GuestNavbar onLoginPatient={loginPatient} onLoginTherapist={loginTherapist} /> }

            { role === 'patient' && <PatientNavbar email={email} onLogout={logout} /> }

            { role === 'therapist' && <TherapistNavbar email={email} onLogout={logout} /> }

          </ul>
          <ul className="navbar-nav ms-auto">
          </ul>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
