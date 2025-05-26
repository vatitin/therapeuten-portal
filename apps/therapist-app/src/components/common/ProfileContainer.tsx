// ProfileContainer.tsx
import { useState } from 'react';
import cx from 'clsx';
import {
  Avatar,
  Burger,
  Container,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { IconChevronDown, IconSettings, IconLogout, IconPlayerPause, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useKeycloak } from '@react-keycloak/web';
import classes from './Header.module.css';

const user = {
  name: 'Jane Spoonfighter',
  email: 'janspoon@fighter.dev',
};

export function ProfileContainer() {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { keycloak, initialized } = useKeycloak();

  const handleLogout = () => {
    if (initialized) {
      keycloak.logout();
    }
  };

  return (
    <Container>
      <Group gap="xs" align="center">
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

        <Menu
          width={260}
          position="bottom-end"
          transitionProps={{ transition: 'pop-top-right' }}
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
          withinPortal
        >
          <Menu.Target>
            <UnstyledButton
              className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
            >
              <Group gap={7}>
                <Avatar alt={user.name} radius="xl" size={20} />
                <Text fw={500} size="sm" lh={1} mr={3}>
                  {user.name}
                </Text>
                <IconChevronDown size={12} stroke={1.5} />
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Settings</Menu.Label>
            <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
              Account settings
            </Menu.Item>

            <Menu.Item onClick={handleLogout} leftSection={<IconLogout size={16} stroke={1.5} />}>
              Logout
            </Menu.Item>

            <Menu.Divider />

            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item leftSection={<IconPlayerPause size={16} stroke={1.5} />}>
              Pause subscription
            </Menu.Item>
            <Menu.Item color="red" leftSection={<IconTrash size={16} stroke={1.5} />}>
              Delete account
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Container>
  );
}
