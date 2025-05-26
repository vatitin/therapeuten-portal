import { Container, Title, Text, Button, Grid, Card, Group, useMantineTheme, rem } from '@mantine/core';
import { createStyles } from '@mantine/styles';
import { IconListDetails, IconUsers } from '@tabler/icons-react';
import { useKeycloak } from '@react-keycloak/web';

import { useMantineColorScheme } from '@mantine/core';

const useStyles = createStyles((theme, _params) => {
  const { colorScheme } = useMantineColorScheme();
  return {
    hero: {
      textAlign: 'center',
      padding: `${rem(80)} 0`,
      backgroundColor:
        colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      borderRadius: theme.radius.md,
    },
    buttonGroup: {
      marginTop: theme.spacing.xl,
    },
    featureCard: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.white,
      borderRadius: theme.radius.md,
      boxShadow: theme.shadows.sm,
    },
    icon: {
      color: theme.colors.yellow[6],
    },
  };
});

export function Home() {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const { keycloak, initialized } = useKeycloak();

  const handleLogin = () => {
    if (initialized) {
      keycloak.login();
    }
  };

  return (
    <Container size="lg" py="xl">
      {/* Hero Section */}
      <div className={classes.hero}>
        <Title order={1}>Therapeuten-Portal</Title>
        <Text size="lg" mt="md">
          Verwalten Sie Ihre Warteliste und Patienten einfach und effizient.
        </Text>
        <Group className={classes.buttonGroup} justify="center" gap="md">
          <Button size="md" onClick={handleLogin}>
            Login
          </Button>
          <Button variant="outline" size="md" onClick={handleLogin}>
            Therapeuten-Anmeldung
          </Button>
        </Group>
      </div>

      {/* Features Section */}
      <Grid mt="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card className={classes.featureCard}>
            <IconListDetails size={32} className={classes.icon} />
            <div>
              <Text fw={500}>Warteliste</Text>
              <Text size="sm" mt="xs">
                Behalten Sie den Überblick über wartende Patienten – einfach, schnell, transparent.
              </Text>
            </div>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card className={classes.featureCard}>
            <IconUsers size={32} className={classes.icon} />
            <div>
              <Text fw={500}>Aktive Patienten</Text>
              <Text size="sm" mt="xs">
                Verwalten Sie Ihre aktiven Patienten effizient – Termine, Notizen und mehr.
              </Text>
            </div>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
