import {
  TextInput,
  PasswordInput,
  Button,
  Box,
  Paper,
  Title,
  Stack,
  Container,
} from '@mantine/core';
import { useForm } from '@mantine/form';

function RegistrationForm() {
  const form = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length < 6 ? 'Password must be at least 6 characters' : null,
    },
  });

  return (
    <Container size={420} my={40}>
      <Title align="center" mb="lg">
        Create an Account
      </Title>

      <Paper withBorder shadow="md" p={30} radius="md">
        <form onSubmit={form.onSubmit(console.log)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="you@example.com"
              {...form.getInputProps('email')}
              required
            />
            <TextInput
              label="First Name"
              placeholder="John"
              {...form.getInputProps('firstName')}
              required
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              {...form.getInputProps('lastName')}
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              {...form.getInputProps('password')}
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

export { RegistrationForm };
