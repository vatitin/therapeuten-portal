import { Drawer, Stack, Text, Group, ActionIcon, Card, Badge, Divider } from '@mantine/core';
import { IconTrash, IconCheck } from '@tabler/icons-react';
import type { AssociationType } from '../../../types/association.type';
import type { TherapistComment } from '../../../types/therapistComment.type';
import CommentsSection from '../comments/CommentsSection';

export function PatientsDetailsDrawer({
  opened,
  association,
  onClose,
  onActivate,
  onRemove,
}: {
  opened: boolean;
  association: (AssociationType & { comments?: TherapistComment[] }) | null;
  onClose(): void;
  onActivate(): void;
  onRemove(): void;
}) {
  if (!association) return null;

  const { patient, applicationText, status } = association;

  return (
    <Drawer opened={opened} onClose={onClose} title="Patient" size="lg" position="right">
      <Stack gap="md">
        <Card withBorder radius="md" p="md">
          <Group mb="sm" wrap="nowrap" justify="space-between">
            <Group wrap="nowrap">
              <Text fw={500} size="lg">
                {patient.firstName} {patient.lastName}
              </Text>
              {status && (
                <Badge color="blue" variant="light">
                  {status}
                </Badge>
              )}
            </Group>
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

        <CommentsSection associationId={association.id} initialComments={association.comments ?? []} />
          
        <Divider />

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
