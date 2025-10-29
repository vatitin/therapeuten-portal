import { useEffect, useState } from 'react';
import axios from 'axios';
import createApiClient from '../../APIService';
import type { TherapistComment } from '../../types/therapistComment.type';
import keycloak from '../../keycloak';

type CreateState = { loading: boolean; error: string | null; success: boolean };
type UpdateState = { loadingId: string | null; error: string | null; successId: string | null };
type ReadState   = { loading: boolean; error: string | null };
type DeleteState = UpdateState;

export function useComments(associationId: string, initial: TherapistComment[] = []) {
  const api = createApiClient(keycloak.token);

  const [comments, setComments] = useState<TherapistComment[]>(initial);
  const [readState, setReadState] = useState<ReadState>({ loading: false, error: null });
  const [createState, setCreateState] = useState<CreateState>({ loading: false, error: null, success: false });
  const [updateState, setUpdateState] = useState<UpdateState>({ loadingId: null, error: null, successId: null });
  const [deleteState, setDeleteState] = useState<DeleteState>({ loadingId: null, error: null, successId: null });

  useEffect(() => { setComments(initial); }, [initial]);

  useEffect(() => {
    if (!associationId) return;

    const abort = new AbortController();

    (async () => {
      setReadState({ loading: true, error: null });
      try {
        const res = await api.get<TherapistComment[]>(
          `http://localhost:3001/therapist/association/${associationId}/comments`,
          { signal: abort.signal }
        );
        setComments(res.data);
      } catch (e: any) {
        // ignore intentional cancels
        if (axios.isCancel(e) || e?.code === 'ERR_CANCELED' || e?.name === 'CanceledError') return;
        setReadState({ loading: false, error: e?.response?.data?.message ?? e?.message ?? 'Fehler beim Laden' });
        return;
      }
      if (!abort.signal.aborted) setReadState({ loading: false, error: null });
    })();

    return () => abort.abort();
  }, [associationId]);

  const createComment = async (text: string) => {
    if (!text.trim()) return;
    setCreateState({ loading: true, error: null, success: false });
    try {
      const res = await api.post<TherapistComment>(
        `http://localhost:3001/therapist/association/${associationId}/comment`,
        { text: text.trim() }
      );
      setComments((prev) => [res.data, ...prev]);
      setCreateState({ loading: false, error: null, success: true });
      setTimeout(() => setCreateState((s) => ({ ...s, success: false })), 1200);
    } catch (e: any) {
      setCreateState({
        loading: false,
        error: e?.response?.data?.message ?? e?.message ?? 'Fehler beim Speichern',
        success: false,
      });
    }
  };

  const updateComment = async (id: string, text: string) => {
    if (!text.trim()) return;
    setUpdateState({ loadingId: id, error: null, successId: null });
    try {
      const res = await api.patch<TherapistComment>(`http://localhost:3001/therapist/association/comment/${id}`, { text: text.trim() });
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, ...res.data } : c)));
      setUpdateState({ loadingId: null, error: null, successId: id });
      setTimeout(() => setUpdateState((s) => ({ ...s, successId: null })), 1200);
    } catch (e: any) {
      setUpdateState({
        loadingId: null,
        error: e?.response?.data?.message ?? e?.message ?? 'Fehler beim Aktualisieren',
        successId: null,
      });
    }
  };

    const deleteComment = async (id: string) => {
    setDeleteState({ loadingId: id, error: null, successId: null });
    try {
      await api.delete(`http://localhost:3001/therapist/association/comment/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
      // successId wird hier nicht wirklich benötigt, aber wir setzen den State zurück
      setDeleteState({ loadingId: null, error: null, successId: id }); 
    } catch (e: any) {
      setDeleteState({
        loadingId: null,
        error: e?.response?.data?.message ?? e?.message ?? 'Fehler beim Löschen',
        successId: null,
      });
    }
  };

  return { 
    comments, 
    createComment, 
    updateComment, 
    deleteComment, 
    createState, 
    updateState, 
    deleteState, 
    readState, 
    setComments 
  };
}
