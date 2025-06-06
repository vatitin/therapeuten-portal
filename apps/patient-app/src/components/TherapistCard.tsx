// src/components/Map.tsx
import 'maplibre-gl/dist/maplibre-gl.css';
import { Group, Paper, Stack, Text, useMantineTheme, useMantineColorScheme, UnstyledButton, Button } from '@mantine/core';
import type { TherapistDTO } from './therapist.dto';
import { IconMapPin, IconUser } from '@tabler/icons-react';

interface TherapistCardProps {
  therapist: TherapistDTO;
  onClick: () => void;
}

export function TherapistCard({ therapist, onClick }: TherapistCardProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
    
 const {
    id,
    firstName,
    lastName,
    addressLine1,
    addressLine2,
    city,
    postalCode,
  } = therapist;

  return (
    <Paper 
        shadow="xl" 
        radius="sm" 
        withBorder p="md"
    >
        <Stack gap="xs">
            <Group gap="xs" >
                <IconUser size={18} />
                <Text fw={500}>
                {firstName} {lastName}
                </Text>
            </Group>

            <Group gap="xs" >
                <IconMapPin size={18} />
                <Text size="sm">
                {addressLine1}
                {addressLine2 ? `, ${addressLine2}` : ''}, {postalCode} {city}
                </Text>
            </Group>

            <Button 
                onClick={onClick}
            >
                Auf Karte anzeigen
            </Button>

        </Stack>
    </Paper>
  );
}

