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
import createApiClient from '../APIService';
import { setTherapistData } from '../endpoints';
import keycloak from '../keycloak';

function SetProfile() {
  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
    },

    validate: {
      firstName: (value) => (value.trim().length < 2 ? 'First name must have at least 2 letters' : null),
      lastName: (value) => (value.trim().length < 2 ? 'Last name must have at least 2 letters' : null),
    },
  });

   const handleSubmit = async (values: typeof form.values) => {
    try {
      console.log('Form values:', values);
      const apiClient = createApiClient(keycloak?.token ?? "");
      await apiClient.post(setTherapistData, values);
      // Handle successful registration (e.g., redirect to login, show success message)
      form.reset(); // Optionally reset the form
    } catch (error: any) {
      console.error('Registration failed:', error);
      // Handle registration error (e.g., show error message to the user)
      if (error.response && error.response.data && error.response.data.message) {
        // Example: if your backend sends an error message
        form.setFieldError('email', error.response.data.message); // Or a general error
      } else {
        // Generic error message
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
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export { SetProfile };
