// src/pages/SearchMapPage.tsx
import { useState } from 'react';
import { Box, Container, Flex, Grid, Group, ScrollArea, Text } from '@mantine/core';
import { HeaderSearch, type HeaderSearchValues } from './HeaderSearch';
import { Map } from '../components/Map';
import type { TherapistLocation } from './therapistLocation';
import { TherapistCard } from './TherapistCard';
import type { TherapistDTO } from './therapist.dto';
import { useNavigate } from 'react-router-dom';

const mapboxAccessToken = 'pk.eyJ1IjoidmF0aXRpbiIsImEiOiJjbWF5OHg1YzUwNmpqMmpzNnR4MjljdXlvIn0.4eCQ0SxTDSfCIdGgpzK2ow';  

export function SearchMapPage() {

  const [locations, setLocations] = useState<TherapistLocation[]>([]);
  const [center, setCenter] = useState<[number, number] | undefined>(undefined);
  const [radius, setRadius] = useState<number>(10);
  const [therapists, setTherapists] = useState<TherapistDTO[]>([]);
  const [selectedTherapistId, setSelectedTherapistId] = useState<string | null>(null);
  const navigate = useNavigate()


  const handleSearch = async (values: HeaderSearchValues) => {
    const { coordinates, distance, categories } = values;
    try {
      const geoRes = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?` +
          `access_token=${mapboxAccessToken}&limit=1`
      );

      const geoData = await geoRes.json();
      if (!geoData.features?.length) {
        alert('Adresse nicht gefunden');
        return;
      }
      console.log("works: "+ geoData.features[0].geometry.coordinates.toString())
      console.log("geoData", geoData)
      const [lng, lat] = geoData.features[0].geometry.coordinates;
      setCenter([lng, lat]);
      const therapistsResult = await fetch(
        `http://localhost:3001/patient/locations?lng=${lng}&lat=${lat}&distance=${distance}${
          categories.length ? `&categories=${categories.join(',')}` : ''
        }`
      );
      if (!therapistsResult.ok) throw new Error(`HTTP ${therapistsResult.status}`);
      console.log("locRes", therapistsResult)
      const therapists = await therapistsResult.json() as TherapistDTO[];

      const locations: TherapistLocation[] = therapists.map((therapist) => ({
        therapistId: therapist.id,
        location: therapist.location
      }));


      setTherapists(therapists);
      setRadius(distance)
      setLocations(locations);
    } catch (err) {
      console.error('Search error', err);
      alert('Fehler beim Laden der Orte');
    }
  };

  const handleTherapistCardClick = (therapistId: string) => {
    console.log("Therapist card clicked:", therapistId);
    setSelectedTherapistId(therapistId);
  }

  const handleApplyClick = (therapistId: string) => {
    console.log("Apply clicked for therapist:", therapistId);
    navigate(`/therapist/${therapistId}`);
  }


  return (
    <Container size="xl">

      <HeaderSearch onSearch={handleSearch} />

      <Grid gutter="md" mt="md">

        <Grid.Col span={6}>
          <Box style={{ height: '70vh' }}>
            
            {therapists.length === 0 && (
              <Group gap="xs" justify="center">
                <Text c="dimmed">Keine Therapeuten für diese Suche gefunden.</Text>
              </Group>
              
            )}

            <ScrollArea style={{ height: '100%' }} offsetScrollbars>
              <Flex direction="column" gap="md">

                {therapists.map((t) => (
                  <TherapistCard 
                  key={t.id} 
                  therapist={t} 
                  onClickShowOnMap={() => handleTherapistCardClick(t.id)} 
                  OnClickApply={() => handleApplyClick(t.id)} />
                ))}

                <Group gap="xs" justify="center">
                  <Text c="dimmed">Keine Weiteren Therapeuten für diese Suche.</Text>
                </Group>
              </Flex>
            </ScrollArea>

          </Box>
        </Grid.Col>

        {/* Rechte Spalte: Map */}
        <Grid.Col span={6}>
          <Box style={{ height: '70vh' }}>
            <Map locations={locations} center={center} radius={radius} selectedTherapistId={selectedTherapistId} />
          </Box>
        </Grid.Col>
      </Grid>

      
    </Container>
  );
}
