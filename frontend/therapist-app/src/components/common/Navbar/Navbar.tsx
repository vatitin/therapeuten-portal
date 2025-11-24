// src/components/common/NavbarSimple.tsx
import { NavLink as RouterNavLink } from 'react-router-dom';
import { IconHome, IconListDetails, IconUser, IconLogout } from '@tabler/icons-react';
import { Box, UnstyledButton, Group, ThemeIcon, Text, useMantineTheme } from '@mantine/core';
import { useKeycloak } from '@react-keycloak/web';

interface NavItem {
  icon: React.FC<any>;
  label: string;
  path: string;
  onClick?: () => void;
}

export function NavbarSimple() {
  const { keycloak } = useKeycloak();
  const theme =useMantineTheme()
  const data: NavItem[] = [
    { icon: IconHome,       label: 'Home',       path: '/home' },
    { icon: IconListDetails, label: 'Warteliste', path: '/waitingPatients' },
    { icon: IconUser,        label: 'Patienten',  path: '/activePatients' },
    { icon: IconLogout,      label: 'Logout',     path: '/nan', onClick: () => keycloak.logout() },
  ];

  return (
    <Box w={300} p="xs">
      {data.map((item) => {
          return (
            <RouterNavLink
              key={item.label}
              to={item.path}
              onClick={item.onClick}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: 12,
                borderRadius: 4,
                backgroundColor: isActive ? theme.colors.gray[4] : undefined,
                textDecoration: 'none',
              })}
            >
              <Group>
                <ThemeIcon variant="light">
                  <item.icon size={20} />
                </ThemeIcon>
                <Text size="xl" c='black'>{item.label}</Text>
              </Group>
            </RouterNavLink>
          );
      
      })}
    </Box>
  );
}
