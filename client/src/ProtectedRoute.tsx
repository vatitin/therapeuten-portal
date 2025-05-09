import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import authService from '../src/services/AuthService';


interface Props { children: React.ReactNode }
/*
export function ProtectedRoute({ children }: Props) {
  const location = useLocation();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      this.keycloakService.login({
        redirectUri: window.location.origin + location.pathname
      });
    }
  }, [location]);

  if (!keycloakService.isAuthenticated()) {
    return <div>Redirecting to login…</div>;
  }

  return <>{children}</>;
}

*/