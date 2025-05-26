import { useKeycloak } from '@react-keycloak/web';
import classes from './Header.module.css';
import { HeaderNotLoggedIn } from './HeaderNotLoggedIn';
import { HeaderLoggedIn } from './HeaderLoggedIn';

export function Header() {
  const { keycloak, initialized } = useKeycloak();


  const isAuthenticated = initialized && keycloak.authenticated;

  return (
    <header className={classes.header}>
        {isAuthenticated
          ? <HeaderLoggedIn />
          : <HeaderNotLoggedIn />}
    </header>
  );
}
