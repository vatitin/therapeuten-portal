import 'maplibre-gl/dist/maplibre-gl.css';
import { Group, Paper, Stack, Text, Button, Container, Textarea, Box } from '@mantine/core';
import type { TherapistDTO } from './therapist.dto';
import { IconMapPin, IconUser } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import createApiClient from './APIService';
import { useParams } from 'react-router-dom';
import { Map } from './features/Map/Map';
import { useKeycloak } from '@react-keycloak/web';

export function ApplyForTherapist() {
    const [therapist, setTherapist] = useState<TherapistDTO>();
    const [applicationText, setApplicationText] = useState('');
    const { id } = useParams();
    const { keycloak, initialized } = useKeycloak();
    
    useEffect(() => {

        const fetchTherapist = async () => {
            console.log("fetch teheerapist dfor apply for the")
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
            const therapistResult = await apiClient.post(`http://localhost:3001/patient/applyTo/${id}`, {applicationText}); 

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
                        selectedTherapistId={therapist.id} 
                        radius = {2}/>
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
                        label="Bewerbungstext"
                        placeholder="Suche Platz weil..."
                        autosize
                        variant="filled"
                        minRows={6}
                        maxRows={10}
                        value={applicationText} 
                        onChange={e => setApplicationText(e.currentTarget.value)}
                    />
                    <Button 
                        color="green"
                        onClick={applyForTherapist}
                        disabled={!applicationText.trim()}  
                    >
                        Für Warteliste anmelden //todo show notification if setApplicationText empty
                    </Button>
                </Stack>
            </Paper>
        
        </Stack>
        
    </Container>
    
  );
}

