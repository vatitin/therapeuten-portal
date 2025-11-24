import { useEffect } from 'react';
import {
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { IconUser, IconChevronDown, IconSettings, IconTrash } from '@tabler/icons-react';
import { useTherapist } from '../../hooks/useTherapist';
import { useNavigate } from 'react-router-dom';

export function ProfileContainer() {
  const theme = useMantineTheme();
  const  therapistProfile = useTherapist();
  const navigate = useNavigate();

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
              <Text fw={500} size="sm" lh={1} mr={3}>
                {therapistProfile.data?.lastName + " " + therapistProfile.data?.firstName}
              </Text>
              <IconUser size={30} />
              <IconChevronDown size={12} stroke={1.5} />
            </Group>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Settings</Menu.Label>
          <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}
            onClick={() => navigate('/myProfile')}>
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
