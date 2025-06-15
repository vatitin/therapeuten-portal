// src/components/Map.tsx
import 'maplibre-gl/dist/maplibre-gl.css';
import { Group, Paper, Stack, Text, useMantineTheme, useMantineColorScheme, UnstyledButton, Button, Container, Flex, Textarea, Box } from '@mantine/core';
import type { TherapistDTO } from './therapist.dto';
import { IconMapPin, IconUser } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import createApiClient from './APIService';
import { useNavigate, useParams } from 'react-router-dom';
import { Map } from '../components/Map';
import { useKeycloak } from '@react-keycloak/web';

export function ApplyForTherapist() {
    const theme = useMantineTheme();
    const [therapist, setTherapist] = useState<TherapistDTO>();
    const { id } = useParams();
    const { keycloak, initialized } = useKeycloak();
    
    useEffect(() => {

        const fetchTherapist = async () => {
            try {
                const apiClient = createApiClient();
                const therapistResult = await apiClient.get(`http://localhost:3001/patient/getTherapist/${id}`); 

                console.log("locRes", therapistResult.data)
                setTherapist(therapistResult.data);

            } catch (err) {
                console.error(err);
            }
        }

        fetchTherapist();

    }, []);

    const applyForTherapist = async () => {
        try {
            if (!initialized) {
                return;
            }
            if (!keycloak.authenticated) {
                keycloak.login({
                    redirectUri: window.location.origin,
                });
            }
            const token = keycloak.token;

            const apiClient = createApiClient(token);
            const therapistResult = await apiClient.post(`http://localhost:3001/patient/applyTo/${id}`); 

            console.log("locRes", therapistResult.data)
            return;

        } catch (err) {
            console.error(err);
        }
    }

    if (!therapist) {
        return <Text>Loading therapist…</Text>;
    }

  return (
    <Container p="10">
        <Stack
            gap="md"
            justify="center"
            align="stretch"
            >
            <Paper 
                withBorder 
                p="lg" 
                radius="md" 
                shadow="md"
                >
                <Group justify="space-between" mb="xs">
                    <Stack gap="xs">
                        <Group gap="xs" >
                            <IconUser size={18} />
                            <Text fw={500}>
                            {therapist.firstName} {therapist.lastName}
                            </Text>
                        </Group>

                        <Group gap="xs" >
                            <IconMapPin size={18} />
                            <Text size="sm">
                            {therapist.addressLine1}
                            {therapist.addressLine2 ? `, ${therapist.addressLine2}` : ''}, {therapist.postalCode} {therapist.city}
                            </Text>
                        </Group>
                    </Stack>

                    <Box style={{ height: '30vh', width: '100%' }}>
                        <Map 
                        locations={[{therapistId: therapist.id, location: therapist.location}]} 
                        center={therapist.location.coordinates} 
                        selectedTherapistId={therapist.id} />
                    </Box>
                </Group>
            </Paper>
            
            <Paper 
                withBorder 
                p="xl" 
                radius="md" 
                shadow="md"
                >

                <Stack>
                    <Textarea
                        label="Autosize with 4 rows max"
                        placeholder="Autosize with 4 rows max"
                        autosize
                        variant="filled"
                        minRows={6}
                        maxRows={10}
                    />
                    <Button 
                        color="green"
                        onClick={() => {applyForTherapist()}}
                    >
                        Für Warteliste anmelden
                    </Button>
                </Stack>
            </Paper>
        
        </Stack>
        
    </Container>
    
  );
}

