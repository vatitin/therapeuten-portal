import { useEffect, useState } from 'react';
import {
  Avatar,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { IconChevronDown, IconSettings, IconTrash } from '@tabler/icons-react';
import { useTherapist } from '../hooks/useTherapist';

export function ProfileContainer() {
  const theme = useMantineTheme();
  const  therapistProfile = useTherapist();

  useEffect(() => {
    if (therapistProfile.error || therapistProfile.loading) return;
  }, [therapistProfile])

  return (
    <Group gap="xs" align="center">

      <Menu
        width={260}
        position="bottom-end"
        transitionProps={{ transition: 'pop-top-right' }}
        withinPortal
      >
        <Menu.Target>
          <UnstyledButton>
            <Group gap={7}>
              <Avatar alt={therapistProfile.data?.lastName + " " + therapistProfile.data?.firstName} radius="xl" size={30} />
              <Text fw={500} size="sm" lh={1} mr={3}>
                {therapistProfile.data?.lastName + " " + therapistProfile.data?.firstName}
              </Text>
              <IconChevronDown size={12} stroke={1.5} />
            </Group>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Settings</Menu.Label>
          <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
            Mein Profil
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item color="red" leftSection={<IconTrash size={16} stroke={1.5} />}>
            Konto löschen
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
