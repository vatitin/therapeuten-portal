import { Outlet } from 'react-router-dom';
import { AppShell, Burger, Group, Text, useMantineTheme } from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import { useDisclosure } from '@mantine/hooks';
import { NavbarSimple } from '../common/Navbar';

export function AppLayout() {
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header style={{ backgroundColor: theme.colors.blue[8] }}>
        <Group h="100%" px="xl" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <MantineLogo size={30} />
          <Text c="white" size="xl">Gregor Rheingeist</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar style={{ backgroundColor: theme.colors.gray[1] }}>
        <NavbarSimple />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <AppShell.Footer style={{ backgroundColor: theme.colors.gray[2] }}>
        <Text size="sm" c="dimmed" ta="center">
          © 2025 Gregor Rheingeist. Alle Rechte vorbehalten.
        </Text>
      </AppShell.Footer>
    </AppShell>
  );
}
