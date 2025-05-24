import React from 'react';
import {
  Container,
  Group,
  Burger,
  Drawer,
  Anchor,
  Button,
  Text,
  useMantineTheme,
  ActionIcon,
  AppShell
} from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { AppRoutes } from '../../constants';
import { useKeycloak } from '@react-keycloak/web';
import { IconHome, IconUsers, IconListDetails, IconLogout } from '@tabler/icons-react';

export function Navbar() {
  const { keycloak, initialized } = useKeycloak();
  const theme = useMantineTheme();
  const [drawerOpened, setDrawerOpened] = React.useState(false);
  const location = useLocation();

  const links = [] as React.ReactNode[];
  if (!initialized || !keycloak.authenticated) {
    links.push(
      <Anchor
        component={Link}
        to="/"
        key="login"
        c={location.pathname === '/' ? 'yellow' : 'white'}
        style={{ fontWeight: 500 }}
      >
        Login
      </Anchor>
    );
    links.push(
      <Button
        key="therapist"
        variant="outline"
        color="yellow"
        size="xs"
        onClick={() => keycloak.login()}
      >
        Therapeuten-Anmeldung
      </Button>
    );
  } else if (keycloak.clientId === 'therapist-client') {
    links.push(
      <Anchor
        component={Link}
        to={AppRoutes.myWaitingPatients}
        key="waiting"
        c={location.pathname === AppRoutes.myWaitingPatients ? 'yellow' : 'white'}
        style={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}
      >
        <IconListDetails size={16} style={{ marginRight: 4 }} /> Warteliste
      </Anchor>
    );
    links.push(
      <Anchor
        component={Link}
        to={AppRoutes.myActivePatients}
        key="patients"
        c={location.pathname === AppRoutes.myActivePatients ? 'yellow' : 'white'}
        style={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}
      >
        <IconUsers size={16} style={{ marginRight: 4 }} /> Patienten
      </Anchor>
    );
    links.push(
      <ActionIcon
        key="logout"
        color="red"
        variant="light"
        onClick={() => keycloak.logout()}
      >
        <IconLogout />
      </ActionIcon>
    );
    links.push(
      <Text key="email" c="gray" size="sm">
        {keycloak.tokenParsed?.email}
      </Text>
    );
  }

  return (
    <AppShell>
      <AppShell.Header style={{ backgroundColor: theme.colors.dark[7], height: 60 }}>
        <Container size="xl" style={{ display: 'flex', alignItems: 'center', height: '100%', padding: theme.spacing.sm }}>
          <Group style={{ flex: 1 }}>
            <ActionIcon
              component={Link}
              to="/"
              variant="light"
              size="lg"
              color="yellow"
            >
              <IconHome size={24} />
            </ActionIcon>
          </Group>

          <Group px="md" style={{ display: 'none', '@media (min-width: 768px)': { display: 'flex' } }}>
            {links}
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={() => setDrawerOpened((o) => !o)}
            size="sm"
            color="white"
            mr="md"
            style={{ '@media (min-width: 768px)': { display: 'none' } }}
          />

          <Drawer
            opened={drawerOpened}
            onClose={() => setDrawerOpened(false)}
            title="Navigation"
            padding="sm"
            size="xs"
          >
            <Group px="sm">
              {links}
            </Group>
          </Drawer>
        </Container>
      </AppShell.Header>
    </AppShell>
  );
}
