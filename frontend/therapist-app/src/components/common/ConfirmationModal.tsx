// ConfirmModal.tsx
import { Modal, Text, Group, Button, Stack } from '@mantine/core';
import type { AssociationType } from '../../types/association.type';

export function ConfirmationModal({
  opened,
  onClose,
  onConfirm,
  action,
  association,
}: {
  opened: boolean;
  onClose(): void;
  onConfirm(): void;
  action: 'remove' | 'activate' | null;
  association: AssociationType | null;
}) {
  if (!association || !action) return null;
  const verb = action === 'remove' ? 'entfernen' : 'aktivieren';

  return (
    <Modal opened={opened} onClose={onClose} title={`Patient wirklich ${verb}?`} centered>
      <Stack>
        <Text>
          Sind Sie sicher, dass Sie {association.patient.firstName} {association.patient.lastName} {verb} wollen?
        </Text>
        <Group justify="center">
          <Button variant="default" onClick={onClose}>
            Abbrechen
          </Button>
          <Button color={action === 'remove' ? 'red' : 'green'} onClick={onConfirm}>
            {verb.charAt(0).toUpperCase() + verb.slice(1)}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
