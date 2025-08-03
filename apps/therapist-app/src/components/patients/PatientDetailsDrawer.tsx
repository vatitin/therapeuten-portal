import { Drawer, Stack, Text, Textarea, Group, ActionIcon, Card, Badge, Divider } from '@mantine/core';
import { IconTrash, IconCheck } from '@tabler/icons-react';
import type { AssociationType } from '../../types/association.type';

export function PatientDetailsDrawer({
  opened,
  association,
  onClose,
  onActivate,
  onRemove,
}: {
  opened: boolean;
  association: AssociationType | null;
  onClose(): void;
  onActivate(): void;
  onRemove(): void;
}) {
  if (!association) return null;
  const { patient, applicationText } = association;

  return (
    <Drawer opened={opened} onClose={onClose} title="Patient" size="lg" position="right">
      <Stack justify="center"
      gap="md">
        <Card withBorder radius="md" p="md">
          <Group mb="sm">
            <Text fw={500} size="lg">
              {patient.firstName} {patient.lastName}
            </Text>
            {association.status && (
              <Badge color="blue" variant="light">
                {association.status}
              </Badge>
            )}
          </Group>

          {applicationText && <Divider mb="sm" />}

          {applicationText && (
            <>
              <Text size="sm" fw={500} mb={4}>
                Notiz
              </Text>
              <Text size="sm" c="dimmed">
                {applicationText}
              </Text>
            </>
          )}
        </Card>

        <Divider />

        <Textarea label="Kommentar" placeholder="Termin vereinbaren…" autosize minRows={6} />

        <Group grow>
          <ActionIcon color="green" onClick={onActivate} title="Auf Aktiv setzen">
            <IconCheck />
          </ActionIcon>
          <ActionIcon color="red" onClick={onRemove} title="Entfernen">
            <IconTrash />
          </ActionIcon>
        </Group>
      </Stack>
    </Drawer>
  );
}
