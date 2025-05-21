import {
  TextInput,
  Paper,
  Title,
  Container,
  Button,
  Anchor,
  Stack,
  Group,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import createApiClient from '../../APIService';
import { createTherapist } from '../../endpoints';
import keycloak from '../../keycloak';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStatus } from '../hooks/useUserStatus';

function SetProfile() {
    const {hasProfile} = useUserStatus();
    const navigate = useNavigate();

    useEffect(() => {
      if(hasProfile){
        //navigate('/'); 
      }
    })

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      address: '',
    },

    validate: {
      firstName: (value) => (value.trim().length < 2 ? 'First name must have at least 2 letters' : null),
      lastName: (value) => (value.trim().length < 2 ? 'Last name must have at least 2 letters' : null),
    },
  });

   const handleSubmit = async (values: typeof form.values) => {
    try {
      const apiClient = createApiClient(keycloak?.token ?? "");
      await apiClient.post(createTherapist, values);
      return;
    } catch (error: any) {
      if (error) {
        form.setFieldError('email', error);
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Container size={460} my={60}>
      <Title
        order={2}
        style={{ fontWeight: 700, textAlign: 'center' }}
      >
        Welcome to Our App
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Anchor size="sm" component="button">
          Login
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Group grow>
              <TextInput
                label="Vorname"
                placeholder="John"
                {...form.getInputProps('firstName')}
                required
              />
              <TextInput
                label="Nachname"
                placeholder="Doe"
                {...form.getInputProps('lastName')}
                required
              />
            </Group>
            <TextInput
              label="Addresse"
              placeholder="Deine Adresse"
              {...form.getInputProps('address')}
              required
            />
          </Stack>

            <Button fullWidth mt="xl" type="submit">
              Speichern
            </Button>
        </form>
      </Paper>
    </Container>
  );
}

export { SetProfile };
