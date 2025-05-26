import { useKeycloak } from '@react-keycloak/web';
import {
  Button,
  Container,
  Group,
  useMantineTheme,
} from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';

export function HeaderNotLoggedIn() {
  const { keycloak, initialized } = useKeycloak();
  const theme = useMantineTheme();

  const handlePatientLogin = () => {
    if (initialized) {
      console.log("ref to patient loginn")
    };
  }
  const handleTherapistLogin = () => {
    if (initialized) {
      keycloak.login();
    }
  };

  return (
    <Container size="md">
      <Group justify="space-between" align="center" style={{ width: '100%' }}>
        <MantineLogo size={28} />

        <Group gap="xs">
          <Button variant="default" onClick={handlePatientLogin} disabled={!initialized}>
            Log in
          </Button>
          <Button onClick={handleTherapistLogin} disabled={!initialized}>
            Therapeuten-Anmeldung
          </Button>
        </Group>
      </Group>
    </Container>
  );
}
