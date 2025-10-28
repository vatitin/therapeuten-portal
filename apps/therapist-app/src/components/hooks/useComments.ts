import { useEffect, useState } from 'react';
import createApiClient from '../../APIService';
import type { TherapistComment } from '../../types/therapistComment.type';


type CreateState = { loading: boolean; error: string | null; success: boolean };
type UpdateState = { loadingId: string | null; error: string | null; successId: string | null };

export function useComments(associationId: string, initial: TherapistComment[] = []) {
  const api = createApiClient();
  const [comments, setComments] = useState<TherapistComment[]>(initial);
  useEffect(() => setComments(initial), [initial]);

  const [createState, setCreateState] = useState<CreateState>({ loading: false, error: null, success: false });
  const [updateState, setUpdateState] = useState<UpdateState>({ loadingId: null, error: null, successId: null });

  const createComment = async (text: string) => {
    if (!text.trim()) return;
    setCreateState({ loading: true, error: null, success: false });
    try {
      const res = await api.post<TherapistComment>(`/therapist/association/${associationId}/comment`, { text: text.trim() });
      setComments((prev) => [res.data, ...prev]);
      setCreateState({ loading: false, error: null, success: true });
      setTimeout(() => setCreateState((s) => ({ ...s, success: false })), 1200);
    } catch (e: any) {
      setCreateState({ loading: false, error: e?.response?.data?.message ?? e?.message ?? 'Fehler beim Speichern', success: false });
    }
  };

  const updateComment = async (id: string, text: string) => {
    if (!text.trim()) return;
    setUpdateState({ loadingId: id, error: null, successId: null });
    try {
      const res = await api.patch<TherapistComment>(`/comments/${id}`, { text: text.trim() });
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, ...res.data } : c)));
      setUpdateState({ loadingId: null, error: null, successId: id });
      setTimeout(() => setUpdateState((s) => ({ ...s, successId: null })), 1200);
    } catch (e: any) {
      setUpdateState({ loadingId: null, error: e?.response?.data?.message ?? e?.message ?? 'Fehler beim Aktualisieren', successId: null });
    }
  };

  return { comments, createComment, updateComment, createState, updateState, setComments };
}
