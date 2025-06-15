// src/components/Map.tsx
import 'maplibre-gl/dist/maplibre-gl.css';
import { Group, Paper, Stack, Text, useMantineTheme, useMantineColorScheme, UnstyledButton, Button } from '@mantine/core';
import type { TherapistDTO } from './therapist.dto';
import { IconMapPin, IconUser } from '@tabler/icons-react';

interface TherapistCardProps {
    therapist: TherapistDTO;
    onClickShowOnMap: () => void;
    OnClickApply: () => void;
}

export function TherapistCard({ therapist, onClickShowOnMap, OnClickApply }: TherapistCardProps) {
    const theme = useMantineTheme();
        
    const {
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
                onClick={onClickShowOnMap}
            >
                Auf Karte anzeigen
            </Button>
            <Button 
                color="green"
                onClick={OnClickApply}
            >
                Für Warteliste anmelden
            </Button>

        </Stack>
    </Paper>
  );
}

