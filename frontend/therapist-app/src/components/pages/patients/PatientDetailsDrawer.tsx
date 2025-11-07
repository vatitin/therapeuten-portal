// import { useEffect, useMemo, useState } from 'react';
// import {
//   Drawer,
//   Stack,
//   Text,
//   Textarea,
//   Group,
//   ActionIcon,
//   Card,
//   Badge,
//   Divider,
//   Button,
//   Title,
//   ScrollArea,
// } from '@mantine/core';
// import { IconTrash, IconCheck, IconEdit, IconX, IconDeviceFloppy, IconPlus } from '@tabler/icons-react';
// import type { AssociationType } from '../../types/association.type';
// import createApiClient from '../../APIService';

// type Comment = {
//   id: string;
//   text: string;
//   createdAt: string | Date;
//   updatedAt?: string | Date;
//   author?: string;
// };

// export function PatientDetailsDrawer({
//   opened,
//   association,
//   onClose,
//   onActivate,
//   onRemove,
// }: {
//   opened: boolean;
//   association: (AssociationType & { comments?: Comment[] }) | null;
//   onClose(): void;
//   onActivate(): void;
//   onRemove(): void;
// }) {
//   if (!association) return null;

//   const { patient, applicationText, status } = association;
//   const apiClient = createApiClient();

//   // Lokaler Kommentar-State (entkoppelt vom Prop, aber bei Wechsel synchronisiert)
//   const initialComments = useMemo(() => association.comments ?? [], [association]);
//   const [comments, setComments] = useState<Comment[]>(initialComments);
//   useEffect(() => setComments(initialComments), [initialComments]);

//   // New comment draft
//   const [draft, setDraft] = useState('');
//   const [createLoading, setCreateLoading] = useState(false);
//   const [createError, setCreateError] = useState<string | null>(null);
//   const [createSuccess, setCreateSuccess] = useState<boolean>(false);

//   // Edit state per comment
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editDraft, setEditDraft] = useState('');
//   const [editLoading, setEditLoading] = useState(false);
//   const [editError, setEditError] = useState<string | null>(null);
//   const [editSuccess, setEditSuccess] = useState<boolean>(false);

//   const formatDate = (d: string | Date) =>
//     new Date(d).toLocaleString(undefined, {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//     });

//   // Backend: Kommentar erstellen
//   const submitNew = async () => {
//     if (!draft.trim()) return;
//     setCreateError(null);
//     setCreateSuccess(false);
//     setCreateLoading(true);
//     try {
//       // Erwartete Route: POST /associations/:associationId/comments  { text }
//       const res = await apiClient.post<Comment>(`/therapist/association/${association.id}/comment`, {
//         text: draft.trim(),
//       });
//       const created = res.data;
//       setComments((prev) => [created, ...prev]); // oben einsortieren
//       setDraft('');
//       setCreateSuccess(true);
//     } catch (e: any) {
//       setCreateError(e?.response?.data?.message ?? e?.message ?? 'Fehler beim Speichern');
//     } finally {
//       setCreateLoading(false);
//       setTimeout(() => setCreateSuccess(false), 1500);
//     }
//   };

//   const startEdit = (c: Comment) => {
//     setEditingId(c.id);
//     setEditDraft(c.text);
//     setEditError(null);
//     setEditSuccess(false);
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditDraft('');
//     setEditError(null);
//     setEditSuccess(false);
//   };

//   // Backend: Kommentar aktualisieren
//   const submitEdit = async () => {
//     if (!editingId) return;
//     if (!editDraft.trim()) return;
//     setEditError(null);
//     setEditSuccess(false);
//     setEditLoading(true);
//     try {
//       // Erwartete Route: PATCH /comments/:commentId  { text }
//       const res = await apiClient.patch<Comment>(`/comments/${editingId}`, {
//         text: editDraft.trim(),
//       });
//       const updated = res.data;
//       setComments((prev) =>
//         prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
//       );
//       setEditSuccess(true);
//       setEditingId(null);
//       setEditDraft('');
//     } catch (e: any) {
//       setEditError(e?.response?.data?.message ?? e?.message ?? 'Fehler beim Aktualisieren');
//     } finally {
//       setEditLoading(false);
//       setTimeout(() => setEditSuccess(false), 1500);
//     }
//   };

//   const onDraftKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
//     if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
//       e.preventDefault();
//       submitNew();
//     }
//   };
//   const onEditKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
//     if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
//       e.preventDefault();
//       submitEdit();
//     }
//   };

//   return (
//     <Drawer opened={opened} onClose={onClose} title="Patient" size="lg" position="right">
//       <Stack gap="md">
//         <Card withBorder radius="md" p="md">
//           <Group mb="sm" wrap="nowrap" justify="space-between">
//             <Group wrap="nowrap">
//               <Text fw={500} size="lg">
//                 {patient.firstName} {patient.lastName}
//               </Text>
//               {status && (
//                 <Badge color="blue" variant="light">
//                   {status}
//                 </Badge>
//               )}
//             </Group>
//           </Group>

//           {applicationText && <Divider mb="sm" />}

//           {applicationText && (
//             <>
//               <Text size="sm" fw={500} mb={4}>
//                 Notiz
//               </Text>
//               <Text size="sm" c="dimmed">
//                 {applicationText}
//               </Text>
//             </>
//           )}
//         </Card>

//         <Divider />

//         <Stack gap="xs">
//           <Title order={5}>Kommentare</Title>

//           <Card withBorder radius="md" p="sm">
//             {comments.length === 0 ? (
//               <Stack gap={6}>
//                 <Text size="sm" c="dimmed">
//                   Noch keine Kommentare. Du kannst einen Kommentar hinzufügen.
//                 </Text>
//               </Stack>
//             ) : (
//               <ScrollArea.Autosize mah={240} type="always">
//                 <Stack gap="sm">
//                   {comments.map((c) => {
//                     const isEditing = editingId === c.id;
//                     return (
//                       <Card key={c.id} withBorder radius="sm" p="sm">
//                         <Group justify="space-between" mb={6}>
//                           <Text size="xs" c="dimmed">
//                             {formatDate(c.updatedAt ?? c.createdAt)}
//                             {c.updatedAt && ' • aktualisiert'}
//                           </Text>
//                           {!isEditing && (
//                             <ActionIcon size="sm" variant="subtle" onClick={() => startEdit(c)} title="Bearbeiten">
//                               <IconEdit size={16} />
//                             </ActionIcon>
//                           )}
//                         </Group>

//                         {!isEditing ? (
//                           <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
//                             {c.text}
//                           </Text>
//                         ) : (
//                           <Stack gap="xs">
//                             <Textarea
//                               autosize
//                               minRows={3}
//                               value={editDraft}
//                               onChange={(e) => setEditDraft(e.currentTarget.value)}
//                               onKeyDown={onEditKeyDown}
//                             />
//                             <Group gap="xs" justify="flex-end">
//                               <Button
//                                 size="xs"
//                                 variant="light"
//                                 leftSection={<IconX size={16} />}
//                                 onClick={cancelEdit}
//                                 disabled={editLoading}
//                               >
//                                 Abbrechen
//                               </Button>
//                               <Button
//                                 size="xs"
//                                 leftSection={<IconDeviceFloppy size={16} />}
//                                 onClick={submitEdit}
//                                 loading={editLoading}
//                               >
//                                 Speichern
//                               </Button>
//                             </Group>
//                             {editError && (
//                               <Text size="xs" c="red">
//                                 {editError}
//                               </Text>
//                             )}
//                             {editSuccess && (
//                               <Text size="xs" c="teal">
//                                 Aktualisiert
//                               </Text>
//                             )}
//                           </Stack>
//                         )}
//                       </Card>
//                     );
//                   })}
//                 </Stack>
//               </ScrollArea.Autosize>
//             )}
//           </Card>

//           <Card withBorder radius="md" p="sm">
//             <Textarea
//               label="Kommentar"
//               description="Neuen Kommentar hinzufügen oder Änderungen dokumentieren."
//               placeholder={comments.length === 0 ? 'Z. B. Termin vorschlagen, Rückrufnotiz, nächste Schritte…' : 'Neuen Kommentar anhängen…'}
//               autosize
//               minRows={6}
//               value={draft}
//               onChange={(e) => setDraft(e.currentTarget.value)}
//               onKeyDown={onDraftKeyDown}
//               disabled={createLoading}
//             />
//             <Group justify="space-between" mt="xs">
//               <Button
//                 leftSection={<IconPlus size={16} />}
//                 onClick={submitNew}
//                 loading={createLoading}
//                 disabled={!draft.trim()}
//               >
//                 Kommentar speichern
//               </Button>
//             </Group>
//             {createError && (
//               <Text size="xs" c="red" mt={6}>
//                 {createError}
//               </Text>
//             )}
//             {createSuccess && (
//               <Text size="xs" c="teal" mt={6}>
//                 Gespeichert
//               </Text>
//             )}
//           </Card>
//         </Stack>

//         <Divider />

//         <Group grow>
//           <ActionIcon color="green" onClick={onActivate} title="Auf Aktiv setzen">
//             <IconCheck />
//           </ActionIcon>
//           <ActionIcon color="red" onClick={onRemove} title="Entfernen">
//             <IconTrash />
//           </ActionIcon>
//         </Group>
//       </Stack>
//     </Drawer>
//   );
// }
