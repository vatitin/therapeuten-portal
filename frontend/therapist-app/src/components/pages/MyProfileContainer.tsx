import { useEffect, useState } from 'react';
import {
  Card,
  Text,
  TextInput,
  Group,
  Avatar,
  Loader,
  Center,
  Stack,
  Button,
  Title,
  Notification,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useTherapist } from '../hooks/useTherapist';
import createApiClient from '../../APIService';

export function MyProfileContainer() {
  const { data, loading, error } = useTherapist();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

  useEffect(() => {
    if (data) {
      setForm(prev => ({ ...prev, ...data }));
    }
  }, [data]);

  if (loading) return <Center h="100%"><Loader /></Center>;
  
  if (error || !data) {
    console.log("MyProfileContainer, error:", error, "data:", data);
    return <Center h="100%"><Text c="red">Fehler beim Laden des Profils.</Text></Center>;
  }

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setSuccess(false);
    setFail(false);
    try {
      const api = createApiClient();
      await api.patch(`/therapist/myProfile`, form);
      setSuccess(true);
    } catch {
      setFail(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Center mt="xl">
      <Card shadow="md" radius="lg" withBorder p="xl" w={500}>
        <Stack align="center" mb="md">
          <Avatar size={90} radius="xl" />
          <Title order={3}>Mein Profil</Title>
        </Stack>

        <Stack>
          <Group grow>
            <TextInput
              label="Vorname"
              value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
            <TextInput
              label="Nachname"
              value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </Group>

          <TextInput
            label="E-Mail"
            value={form.email}
            disabled
          />

          <TextInput
            label="Telefonnummer"
            value={form.phoneNumber || ''}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
          />

          <TextInput
            label="Geschlecht"
            placeholder="optional"
            value={form.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value)}
          />

          <TextInput
            label="Adresse"
            value={form.addressLine1}
            onChange={(e) => handleChange('addressLine1', e.target.value)}
          />

          <TextInput
            label="Adresszusatz"
            placeholder="optional"
            value={form.addressLine2 || ''}
            onChange={(e) => handleChange('addressLine2', e.target.value)}
          />

          <Group grow>
            <TextInput
              label="PLZ"
              value={form.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
            />
            <TextInput
              label="Stadt"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </Group>
        </Stack>

        <Group mt="xl" justify="flex-end">
          <Button onClick={handleSubmit} loading={saving}>
            Änderungen speichern
          </Button>
        </Group>

        {success && (
          <Notification icon={<IconCheck size={16} />} color="green" mt="md">
            Profil erfolgreich aktualisiert.
          </Notification>
        )}
        {fail && (
          <Notification icon={<IconX size={16} />} color="red" mt="md">
            Fehler beim Speichern.
          </Notification>
        )}
      </Card>
    </Center>
  );
}
