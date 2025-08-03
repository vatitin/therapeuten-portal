import { Routes, Route } from 'react-router-dom';
import { Home } from './components/pages/Home';
import { CreatePatient } from './components/pages/CreatePatient';
import { Profile } from './components/pages/Profile';
import { PageNotFound } from './components/pages/PageNotFound';
import { SetProfile } from './components/pages/SetProfile';
import { WaitingPatientsPage } from './components/patients/WaitingPatientsPage';
import { ActivePatientsPage } from './components/patients/ActivePatientsPage';
import { NavbarSimple } from './components/common/Navbar';
import { AppShell, Burger, Group, useMantineTheme, Text } from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import { useDisclosure } from '@mantine/hooks';
import { RequireProfile } from "./components/auth/RequireProfile";

export const AppRoutes = () => {
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();

  return (
    <RequireProfile>
      <AppShell
        header={{ height: 80 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShell.Header
          style={() => ({
            backgroundColor: theme.colors.blue[8],
          })}
        >
          <Group h="100%" px="xl" justify="space-between">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <MantineLogo size={30} />
            <Text c="white" size='xl'>Gregor Rheingeist</Text>
          </Group>

        </AppShell.Header >
        <AppShell.Navbar 
          style={() => ({
            backgroundColor: theme.colors.gray[1],
          })}
        >
          <NavbarSimple />
        </AppShell.Navbar>
        <AppShell.Main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/addNewPatient/:patientStatus" element={<CreatePatient />} />
            <Route path="/waitingPatients" element={<WaitingPatientsPage />} />
            <Route path="/activePatients" element={<ActivePatientsPage />} />

            <Route path="/myProfile" element={<Profile />} />
            <Route path="/setProfile" element={<SetProfile />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </RequireProfile>
  );
};
