// src/pages/CreatePatient.tsx
import { Container, Title, Paper, Stack, Group, TextInput, Button, Combobox, Input, InputBase, useCombobox } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import createApiClient from '../../../api/APIService';
import { addPatientWithStatus } from '../../../api/endpoints';

export function CreatePatient() {
  const { patientStatus } = useParams();
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();

  const form = useForm({
    initialValues: {
      firstName:   '',
      lastName:    '',
      email:       '',
      phoneNumber: '',
      gender:      '',
    },
    validate: {
      firstName:   (v) => (v.trim().length < 2 ? 'Min. 2 Zeichen' : null),
      lastName:    (v) => (v.trim().length < 2 ? 'Min. 2 Zeichen' : null),
      email:       (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Ungültige E-Mail'),
    },
  });

  const genders = ['weiblich', 'männlich', 'divers', 'keine Angabe'];

  const genderOptions = genders.map((gender) => (
    <Combobox.Option value={gender} key={gender}>
      {gender}
    </Combobox.Option>
  ));

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (!patientStatus) {
        form.setErrors({ firstName: 'Patient-Status fehlt in URL' });
        return;
      }
      const payload = {
        ...values,
        gender: !values.gender || values.gender === 'keine Angabe' ? null : values.gender,
      };
      const api = createApiClient(keycloak.token);
      await api.post(addPatientWithStatus(patientStatus), payload);
      navigate(`/myPatients/${patientStatus}`);
    } catch (err) {
      form.setFieldError('firstName', 'Fehler beim Speichern');
      console.error(err);
    }
  };

  return (
    <Container size="xs" >
      <Title order={2} ta="center" fw={700}>
        Patient hinzufügen
      </Title>

      <Paper withBorder shadow="md" p="xl" mt="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Vorname"
                placeholder="Max"
                required
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Nachname"
                placeholder="Mustermann"
                required
                {...form.getInputProps('lastName')}
              />
            </Group>

            <TextInput
              label="E-Mail"
              type="email"
              placeholder="max@example.com"
              required
              {...form.getInputProps('email')}
            />

            <TextInput
              label="Handynummer"
              placeholder="+49 160 1234567"
              {...form.getInputProps('phoneNumber')}
            />

            <Combobox
              position="bottom-start" 
              middlewares={{ flip: false }}   
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
                <Combobox.Options>{genderOptions}</Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
          </Stack>

          <Button fullWidth mt="xl" type="submit">
            Hinzufügen
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
