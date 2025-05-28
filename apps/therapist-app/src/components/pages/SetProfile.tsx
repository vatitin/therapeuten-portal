import { useEffect, useState } from 'react';
import {
  TextInput,
  Paper,
  Title,
  Container,
  Button,
  Stack,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { AddressAutofill } from '@mapbox/search-js-react';
import createApiClient from '../../APIService';
import { createTherapist } from '../../endpoints';
import keycloak from '../../keycloak';
import { useNavigate } from 'react-router-dom';
import { useUserStatus } from '../hooks/useUserStatus';

export function SetProfile() {
  const { hasProfile } = useUserStatus();
  const navigate = useNavigate();
  const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';  

  useEffect(() => {
    if (hasProfile) {
      //navigate('/');
    }
  }, [hasProfile]);

  const form = useForm({
    initialValues: {
      firstName:    '',
      lastName:     '',
      addressLine1: '',
      addressLine2: '',
      city:         '',
      postalCode:   '',
    },
    validate: {
      firstName:    (v) => (v.trim().length < 2 ? 'Min. 2 Zeichen' : null),
      lastName:     (v) => (v.trim().length < 2 ? 'Min. 2 Zeichen' : null),
      addressLine1: (v) => (v.trim().length === 0 ? 'Pflichtfeld' : null),
      city:         (v) => (v.trim().length === 0 ? 'Pflichtfeld' : null),
      postalCode:   (v) => (v.trim().length === 0 ? 'Pflichtfeld' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    // todo use user confirmation by minimap instead of this big callbac
    let longitude = null;
    let latitude = null;
      const fullAddress = `${values.addressLine1} ${values.addressLine2} ${values.postalCode} ${values.city}`;
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            fullAddress
          )}.json?access_token=${mapboxAccessToken}&limit=1`
        );
        const data = await res.json();
        const feat = data.features?.[0];
        console.log('Geocode response:', feat.geometry.coordinates);
        if (feat?.geometry?.coordinates) {
          [longitude, latitude] = feat.geometry.coordinates;
        }
      } catch (err) {
        console.error('Geocode fallback failed', err);
      }
      if (!longitude || !latitude) {
        form.setFieldError(
          'addressLine1',
          'Bitte wählen Sie eine Adresse aus den Vorschlägen oder geben Sie eine gültige Adresse ein.'
        );
        return;
      }
    
    try {      
      console.log(
        'Submitting therapist profile with coords:',
      );

      const payload = {
        ...values,
        location: {
          type: 'Point',
          coordinates:[longitude, latitude]
        }
      };

      console.log("long ot sub: " + payload.location.coordinates.toString())

      const api = createApiClient(keycloak.token ?? '');
      await api.post(createTherapist, payload);
      navigate('/');
    } catch (err: any) {
      form.setFieldError('addressLine1', err.message || 'Fehler beim Speichern');
    }
  };

  // whenever Chrome autofills a number into addressLine2, move it to addressLine1
  useEffect(() => {
    const num = form.values.addressLine2.trim();
    if (num && /^\d+/.test(num)) {
      if (!form.values.addressLine1.includes(num)) {
        form.setFieldValue(
          'addressLine1',
          `${form.values.addressLine1} ${num}`.trim()
        );
      }
      form.setFieldValue('addressLine2', '');
    }
  }, [form.values.addressLine2]);

  return (
    <Container size={460} my={60}>
      <Title order={2} ta="center" fw={700}>
        Profil anlegen
      </Title>

      <Paper withBorder shadow="md" p="xl" mt="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Vorname"
                placeholder="John"
                required
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Nachname"
                placeholder="Doe"
                required
                {...form.getInputProps('lastName')}
              />
            </Group>

            <AddressAutofill
              accessToken={mapboxAccessToken}
            >
              <div>
                <Stack gap="xs">
                  <TextInput
                    label="Straße & Hausnummer"
                    placeholder="Musterstraße 1"
                    required
                    {...form.getInputProps('addressLine1')}
                    name="address-line1"
                    autoComplete="address-line1"
                  />

                  <TextInput
                    label="Adresszusatz (optional)"
                    placeholder="z. B. Gebäudeteil"
                    {...form.getInputProps('addressLine2')}
                    name="address-line2"
                    autoComplete="address-line2"
                  />

                  <Group grow>
                    <TextInput
                      label="Stadt"
                      placeholder="Karlsruhe"
                      required
                      {...form.getInputProps('city')}
                      name="address-level2"
                      autoComplete="address-level2"
                    />
                    <TextInput
                      label="Postleitzahl"
                      placeholder="76131"
                      required
                      {...form.getInputProps('postalCode')}
                      name="postal-code"
                      autoComplete="postal-code"
                    />
                  </Group>
                </Stack>
              </div>
            </AddressAutofill>
          </Stack>

          <Button fullWidth mt="xl" type="submit">
            Speichern
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
