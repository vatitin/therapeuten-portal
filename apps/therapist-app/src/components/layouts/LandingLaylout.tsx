import { AppShell, Group, Button, Container, Text, useMantineTheme } from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import { useKeycloak } from '@react-keycloak/web';
import type { ReactNode } from 'react';

interface LandingLayoutProps {
  children: ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  const theme = useMantineTheme();
  const { keycloak, initialized } = useKeycloak();

  return (
    <AppShell
      header={{ height: 80 }}
      padding="md"
    >
      <AppShell.Header style={{ backgroundColor: theme.colors.blue[8] }}>
        <Group h="100%" px="xl" justify="space-between">
          <MantineLogo size={30} />
          <Text c="white" size="xl">Portal für Therapeuten</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        {children}
        <Container size="sm" style={{ textAlign: 'center', marginTop: 80 }}>
          <Text size="lg" mb="md">
            Willkommen im Therapeuten-Portal!<br />
            Hier können Sie Ihre Patienten verwalten, Termine einsehen und vieles mehr.
          </Text>
          <Button
            size="lg"
            onClick={() => initialized && keycloak.login()}
            disabled={!initialized}
          >
            Jetzt anmelden
          </Button>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
