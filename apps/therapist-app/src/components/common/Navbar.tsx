import { Button, Group, Anchor, Flex, Box, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { AppRoutes } from '../../constants';
import { useKeycloak } from '@react-keycloak/web';
import { useUserStatus } from '../hooks/useUserStatus';

function GuestNavbar({ onLoginTherapist }: { onLoginTherapist: () => void }) {
  return (
    <Group>
      <Anchor component={Link} to="/" size="sm" c="white">
        Login
      </Anchor>
      <Anchor
        component="button"
        onClick={onLoginTherapist}
        size="sm"
        c="white"
      >
        Therapeuten-Anmeldung
      </Anchor>
    </Group>
  );
}

function TherapistNavbar({ email, onLogout }: { email: string; onLogout: () => void }) {
  return (
    <Group>
      <Anchor component={Link} to={AppRoutes.myWaitingPatients} size="sm" c="white">
        Warteliste
      </Anchor>
      <Anchor component={Link} to={AppRoutes.myActivePatients} size="sm" c="white">
        Patienten
      </Anchor>
      <Button variant="subtle" size="sm" onClick={onLogout} c="white">
        Logout
      </Button>
      <Text size="sm" c="dimmed">
        {email}
      </Text>
    </Group>
  );
}

const Navbar = () => {
  const { keycloak, initialized } = useKeycloak();
  console.log('kk' + initialized);
  return (
    <Box bg="dark" px="md" py="sm">
      <Flex justify="space-between" align="center">
        <Group>
          <Anchor component={Link} to="/" size="md" fw={500} c="white">
            Home
          </Anchor>
        </Group>

        <Group>
          {!initialized || !keycloak.authenticated && (
            <GuestNavbar onLoginTherapist={ () => {
              keycloak.login();
            }
            } />
          )}

          {initialized &&
            keycloak.authenticated &&
            keycloak.clientId === 'therapist-client' && (
              <TherapistNavbar
                email={keycloak.tokenParsed?.email || 'Therapist'}
                onLogout={() => keycloak.logout()}
              />
            )}
        </Group>
      </Flex>
    </Box>
  );
};

export { Navbar };
