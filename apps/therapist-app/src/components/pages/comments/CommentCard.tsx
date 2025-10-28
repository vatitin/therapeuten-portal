import { useState } from 'react';
import { Card, Group, Text, Textarea, Button } from '@mantine/core';
import { IconEdit, IconX, IconDeviceFloppy } from '@tabler/icons-react';
import type { TherapistComment } from '../../../types/therapistComment.type';

function formatDate(d: string | Date) {
  return new Date(d).toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CommentCard({
  comment,
  onUpdate,
  updating,
  updateError,
  updateSuccess,
}: {
  comment: TherapistComment;
  onUpdate: (id: string, text: string) => Promise<void>;
  updating: boolean;
  updateError: string | null;
  updateSuccess: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.text);

  const submit = async () => {
    if (!draft.trim()) return;
    await onUpdate(comment.id, draft);
    setIsEditing(false);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  return (
    <Card withBorder radius="sm" p="sm">
      <Group justify="space-between" mb={6}>
        <Text size="xs" c="dimmed">
          {formatDate(comment.updatedAt ?? comment.createdAt)}
          {comment.updatedAt && ' • aktualisiert'}
        </Text>
        {!isEditing && (
          <Button size="xs" variant="subtle" leftSection={<IconEdit size={16} />} onClick={() => setIsEditing(true)}>
            Bearbeiten
          </Button>
        )}
      </Group>

      {!isEditing ? (
        <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
          {comment.text}
        </Text>
      ) : (
        <>
          <Textarea
            autosize
            minRows={3}
            value={draft}
            onChange={(e) => setDraft(e.currentTarget.value)}
            onKeyDown={onKeyDown}
          />
          <Group gap="xs" justify="flex-end" mt="xs">
            <Button size="xs" variant="light" leftSection={<IconX size={16} />} onClick={() => setIsEditing(false)} disabled={updating}>
              Abbrechen
            </Button>
            <Button size="xs" leftSection={<IconDeviceFloppy size={16} />} onClick={submit} loading={updating}>
              Speichern
            </Button>
          </Group>
          {updateError && (
            <Text size="xs" c="red" mt={6}>
              {updateError}
            </Text>
          )}
          {updateSuccess && (
            <Text size="xs" c="teal" mt={6}>
              Aktualisiert
            </Text>
          )}
        </>
      )}
    </Card>
  );
}
