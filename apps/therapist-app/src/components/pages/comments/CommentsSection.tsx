import { useState } from 'react';
import {
  Card,
  Stack,
  Title,
  Text,
  Textarea,
  Button,
  Group,
  ScrollArea,
  Loader,
  Center,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import CommentCard from './CommentCard';
import { useComments } from '../../hooks/useComments';
import type { TherapistComment } from '../../../types/therapistComment.type';

type CommentsSectionProps = {
  associationId: string;
  initialComments?: TherapistComment[];
};

export default function CommentsSection({
  associationId,
  initialComments = [],
}: CommentsSectionProps) { 
  const {
    comments,
    createComment,
    updateComment,
    deleteComment,
    createState,
    updateState,
    deleteState,
    readState,
  } = useComments(associationId, initialComments);

  const [draft, setDraft] = useState('');

  const submitNew = async () => {
    if (!draft.trim()) return;
    await createComment(draft);
    setDraft('');
  };

  const onDraftKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      submitNew();
    }
  };

  return (
    <Stack gap="xs">
      <Title order={5}>Kommentare</Title>

      <Card withBorder radius="md" p="sm">
        {readState.loading ? (
          <Center py="sm">
            <Loader size="sm" />
          </Center>
        ) : comments.length === 0 ? (
          <Stack gap={6}>
            {readState.error ? (
              <Text size="sm" c="red">
                {readState.error}
              </Text>
            ) : (
              <Text size="sm" c="dimmed">
                Noch keine Kommentare. Du kannst einen Kommentar hinzufügen.
              </Text>
            )}
          </Stack>
        ) : (
          <ScrollArea.Autosize mah={240} type="always">
            <Stack gap="sm">
              {comments.map((c) => (
                <CommentCard
                  key={c.id}
                  comment={c}
                  onUpdate={updateComment}
                  updating={updateState.loadingId === c.id}
                  updateError={
                    updateState.loadingId === c.id ? updateState.error : null
                  }
                  updateSuccess={updateState.successId === c.id}
                  onDelete={deleteComment}
                  deleting={deleteState.loadingId === c.id}
                  deleteError={
                    deleteState.loadingId === c.id ? deleteState.error : null
                  }
                />
              ))}
            </Stack>
          </ScrollArea.Autosize>
        )}
      </Card>

      <Card withBorder radius="md" p="sm">
        <Textarea
          label="Kommentar"
          description="Neuen Kommentar hinzufügen oder Änderungen dokumentieren."
          placeholder={
            comments.length === 0
              ? 'Z. B. Termin vorschlagen, Rückrufnotiz, nächste Schritte…'
              : 'Neuen Kommentar anhängen…'
          }
          autosize
          minRows={6}
          value={draft}
          onChange={(e) => setDraft(e.currentTarget.value)}
          onKeyDown={onDraftKeyDown}
          disabled={createState.loading}
        />
        <Group justify="space-between" mt="xs">
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={submitNew}
            loading={createState.loading}
            disabled={!draft.trim()}
          >
            Kommentar speichern
          </Button>
        </Group>
        {createState.error && (
          <Text size="xs" c="red" mt={6}>
            {createState.error}
          </Text>
        )}
        {createState.success && (
          <Text size="xs" c="teal" mt={6}>
            Gespeichert
          </Text>
        )}
      </Card>
    </Stack>
  );
}

