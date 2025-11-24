import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useAssociations } from '../../hooks/useAssociations';
import { PatientsTable } from '../../components/features/Patients/PatientsTable';
import { PatientsDetailsDrawer } from '../../components/features/Patients/PatientsDetailsDrawer';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { Button, Container, Group, Title, Text, Stack, Divider } from '@mantine/core';
import createApiClient from '../../api/APIService';
import { deletePatientWithId, updatePatientStatus } from '../../api/endpoints';
import { StatusType } from '../../config/constants';
import type { AssociationType } from '../../types/association.type';

export function WaitingPatientsPage() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
    const fetchAssociations = useAssociations(StatusType.WAITING, keycloak.token ?? "");

  const [associations, setAssociations] = useState<AssociationType[]>([]);
  const [active, setActive] = useState<AssociationType | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [action, setAction] = useState<'remove' | 'activate' | null>(null);

  const handleRowClick = (assoc: AssociationType) => {
    setActive(assoc);
    setDrawerOpen(true);
  };

  useEffect(() => {
    setAssociations(fetchAssociations);
  }, [fetchAssociations])

  const handleConfirm = async () => { 
    console.log("handleConfirm")
    if (!active || !action) return;
    const api = createApiClient(keycloak.token);
    if (action === 'remove') {
        console.log("deleted")
        await api.delete(deletePatientWithId(active.patient.id));
    } else {
      console.log("activte pateint")
        await api.patch(updatePatientStatus(active.patient.id, StatusType.ACTIVE));
    }

    setConfirmOpen(false);
    setDrawerOpen(false);
    console.log("active", active)
    setAssociations((prev) =>
        prev.filter((a) => a.patient.id !== active!.patient.id)
    );
  };

  return (
    <Container size="lg" style={{ marginLeft: 0 }}>
      <Stack gap="xs">
        <Title order={3} mb="xs">
          Patientenübersicht
        </Title>
        <Text size="lg">
          Hier siehst du eine Liste aller wartenden Patienten . Klicke auf eine Zeile, um Details anzuzeigen oder Aktionen durchzuführen.
        </Text>
        <Divider my="md" />

        <PatientsTable associations={associations} onRowClick={handleRowClick} />

        <Group justify='center'>
          <Button onClick={() => navigate(`/addNewPatient/${StatusType.WAITING}`)}>
            Patient hinzufügen
          </Button>
        </Group>

        <PatientsDetailsDrawer
          opened={drawerOpen}
          association={active}
          onClose={() => setDrawerOpen(false)}
          onActivate={() => {
            setAction('activate');
            setConfirmOpen(true);
          }}
          onRemove={() => {
            setAction('remove');
            setConfirmOpen(true);
          }}
        />

        <ConfirmationModal
          opened={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
          action={action}
          association={active}
        />
      </Stack>
    </Container>
  );
}
