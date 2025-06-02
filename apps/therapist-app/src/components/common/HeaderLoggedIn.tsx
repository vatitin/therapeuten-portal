import { Container, Group, Tabs } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import classes from './Header.module.css'
import { ProfileContainer } from './ProfileContainer';

const tabs = ['Home', 'Patienten'] as const;

const tabToRoute: Record<typeof tabs[number], string> = {
  Home: '/',
  Patienten: '/myPatients/waiting',
};

export function HeaderLoggedIn() {
  const navigate = useNavigate();

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab}>
      {tab}
    </Tabs.Tab>
  ));

  return (
    <Container size="md">
      <Group justify="space-between" align="center" style={{ width: '100%' }}>
        <Tabs
          defaultValue="Home"
          variant="outline"
          visibleFrom="sm"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
          onChange={(value) => {
            const tab = value as typeof tabs[number] | null;
            if (tab && tabToRoute[tab]) {
              navigate(tabToRoute[tab]);
            }
          }}
        >
          <Tabs.List>{items}</Tabs.List>
        </Tabs>

        <ProfileContainer />
      </Group>
    </Container>
  );
}
