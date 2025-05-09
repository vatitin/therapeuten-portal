import { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

export function useAuth() {
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState('guest');

  useEffect( () => {
    (async () => {
      try {
        const returnedRole = await AuthService.init();
        setRole(returnedRole);
        setReady(true);
      }catch {
        //todo remove or fix or whatever
        console.log("error gefangen")
      }

    })();
  }, []);

  return {
    ready,
    role,
    email: AuthService.email,
    loginPatient: AuthService.loginPatient.bind(AuthService),
    loginTherapist: AuthService.loginTherapist.bind(AuthService),
    logout: AuthService.logout.bind(AuthService),
  };
}
