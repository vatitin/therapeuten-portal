import { useEffect } from 'react';
import {
  TextInput,
  Paper,
  Title,
  Container,
  Button,
  Stack,
  Group,
  Combobox,
  InputBase,
  Input,
  useCombobox,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import createApiClient from './APIService';
import { useKeycloak } from '@react-keycloak/web';
import { useUserStatus } from '../hooks/useUserStatus';

export function SetProfile() {
  const hasProfile = useUserStatus();
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();

  const genders = ['weiblich', 'männlich', 'divers', 'keine Angabe'];

  useEffect(() => {
    if (hasProfile) {
      //todo check when or where to actually use this redirect
      //navigate('/');
    }
  }, [hasProfile]);

  const form = useForm({
    initialValues: {
      firstName:    '',
      lastName:     '',
      gender: '',
      phoneNumber: '',
    },
    validate: {
      firstName:    (v) => (v.trim().length < 2 ? 'Min. 2 Zeichen' : null),
      lastName:     (v) => (v.trim().length < 2 ? 'Min. 2 Zeichen' : null),
    },
  });

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const gernderOptions = genders.map((gender) => (
    <Combobox.Option value={gender} key={gender}>
      {gender}
    </Combobox.Option>
  ));

  const handleSubmit = async (values: typeof form.values) => {
    try {      
      console.log(
        'Submitting patient profile:',
      );

      const payload = values;

      if (!initialized) {
        return;
      }

      const api = createApiClient(keycloak.token ?? '');
      await api.post('http://localhost:3001/patient/createPatient', payload);
      navigate('/');
    } catch (err: any) {
      form.setFieldError('Fehler', err.message || 'Fehler beim Speichern');
    }
  };

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
                placeholder="Vorname"
                required
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Nachname"
                placeholder="Nachname"
                required
                {...form.getInputProps('lastName')}
              />
            </Group>
             <Combobox
                store={combobox}
                onOptionSubmit={(val) => {
                  form.setFieldValue('gender',(val));
                  combobox.closeDropdown();
                }}
              >
                <Combobox.Target>
                  <InputBase              
                    label="Geschlecht"
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    rightSectionPointerEvents="none"
                    onClick={() => combobox.toggleDropdown()}
                  >
                    {form.values.gender || <Input.Placeholder>Auswählen</Input.Placeholder>}
                  </InputBase>
                </Combobox.Target>

                <Combobox.Dropdown>
                  <Combobox.Options>{gernderOptions}</Combobox.Options>
                </Combobox.Dropdown>
              </Combobox>
          </Stack>

          <Button fullWidth mt="xl" type="submit">
            Speichern
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
