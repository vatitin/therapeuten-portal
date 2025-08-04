import { useKeycloak } from '@react-keycloak/web';
import {
  AppShell,
  Group,
  Button,
  Container,
  Text,
  useMantineTheme,
  Burger,
} from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';

export function LandingPage() {
  const { keycloak, initialized } = useKeycloak();
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();

  return (
    <AppShell
      header={{ height: 80 }}
      padding="md"
    >
      <AppShell.Header
        style={{
          backgroundColor: theme.colors.blue[8],
        }}
      >
        <Group h="100%" px="xl" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <MantineLogo size={30} />
          <Text c="white" size="xl">
            Portal für Therapeuten
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="sm" style={{ textAlign: 'center', marginTop: 80 }}>
          <Text size="lg" mb="md">
            Willkommen im Therapeuten-Portal!<br />
            Hier können Sie Ihre Patienten verwalten, Termine einsehen und vieles mehr.
          </Text>

          <Group justify="center" gap="md" mt="xl">
            <Button
              size="lg"
              onClick={() => initialized && keycloak.login()}
              disabled={!initialized}
            >
              Jetzt anmelden
            </Button>
            
            <Button
              component={Link}
              to="/home"
              size="lg"
              variant="outline"
            >
              Zur Startseite
            </Button>
          </Group>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
