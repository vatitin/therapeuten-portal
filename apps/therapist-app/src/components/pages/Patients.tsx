// src/components/patients/Patients.tsx
import { useEffect, useState } from 'react';
import cx from 'clsx';
import {
  Button,
  Container,
  Group,
  ScrollArea,
  Table,
  ActionIcon,
  Modal,
  Text,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { IconTrash, IconCheck } from '@tabler/icons-react';
import createApiClient from '../../APIService';
import {
  patientsWithStatus,
  deletePatientWithId,
  updatePatient,
} from '../../endpoints';
import { StatusType } from '../../constants';
import type { PatientType } from '../../types/patient.types';
import classes from './TableScrollArea.module.css';
import type { AxiosInstance } from 'axios';

export function Patients() {
  const { patientStatus } = useParams<{ patientStatus: string }>();
  const [patients, setPatients] = useState<PatientType[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);
  const [modalAction, setModalAction] = useState<'remove' | 'activate' | null>(null);
  const [modalPatient, setModalPatient] = useState<PatientType | null>(null);
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (
      patientStatus !== StatusType.WAITING &&
      patientStatus !== StatusType.ACTIVE
    ) {
      navigate('*');
      return;
    }
    if (!initialized) {
        return;
    }
    if (!keycloak.authenticated || !keycloak.token) {
        keycloak.login();
        return;
    }

    async function loadPatients(token: string) {
        try {
        const apiClient: AxiosInstance = createApiClient(token);
        const res = await apiClient.get<PatientType[]>(
            patientsWithStatus(patientStatus!)
        );
        console.log('Response status:', res.status);
        if (res.status === 200 && res.data) {
            setPatients(res.data);
        } else {
            console.error('Failed to fetch patients, status:', res.status);
            // TODO: show a notification to the user here
        }
        } catch (err) {
        console.error('Error fetching patients', err);
        // TODO: show a notification to the user here
        }
    }

  loadPatients(keycloak.token);

  }, [patientStatus, initialized, keycloak, navigate]);


  const handleConfirm = async () => {
    if (!modalPatient || !modalAction) return;
    const api = createApiClient(keycloak.token ?? '');
    if (modalAction === 'remove') {
      const res = await api.delete(deletePatientWithId(modalPatient.id));
      if (res.status === 200) {
        setPatients((prev) => prev.filter((p) => p.id !== modalPatient.id));
      }
    } else {
      const res = await api.patch(
        updatePatient(modalPatient.id, StatusType.ACTIVE)
      );
      if (res.status === 200) {
        setPatients((prev) => prev.filter((p) => p.id !== modalPatient.id));
      }
    }
    setConfirmModalOpened(false);
  };

  const rows = patients.map((patient) => (
    <Table.Tr
      key={patient.id}
      onClick={() => navigate(`/patient/${patient.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <Table.Td>
        {patient.firstName ?? ''} {patient.lastName ?? ''}
      </Table.Td>
      <Table.Td>{patient.email}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          {patientStatus === StatusType.WAITING && (
            <ActionIcon
              onClick={(e) => {
                e.stopPropagation();
                setModalPatient(patient);
                setModalAction('activate');
                setConfirmModalOpened(true);
              }}
              title="Auf Aktiv setzen"
            >
              <IconCheck size={18} />
            </ActionIcon>
          )}
          <ActionIcon
            color="red"
            onClick={(e) => {
              e.stopPropagation();
              setModalPatient(patient);
              setModalAction('remove');
              setConfirmModalOpened(true);
            }}
            title="Entfernen"
          >
            <IconTrash size={18} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="md">
      <ScrollArea
        h={300}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table miw={700} striped highlightOnHover>
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Aktionen</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>

      <Group justify="center" mt="md">
        <Button onClick={() => navigate(`/addNewPatient/${patientStatus}`)}>
          Patient hinzufügen
        </Button>
      </Group>

      {/* Confirmation Modal */}
      <Modal
        opened={confirmModalOpened}
        onClose={() => setConfirmModalOpened(false)}
        title={
          modalAction === 'remove'
            ? 'Patient wirklich entfernen?'
            : 'Patient auf aktiv setzen?'
        }
        centered
      >
        <Text>
          Sind Sie sicher, dass Sie{' '}
          {modalAction === 'remove' ? 'entfernen' : 'aktivieren'}
          {modalPatient
            ? `: ${modalPatient.firstName} ${modalPatient.lastName}`
            : ''}
          ?
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setConfirmModalOpened(false)}>
            Abbrechen
          </Button>
          <Button color={modalAction === 'remove' ? 'red' : 'green'} onClick={handleConfirm}>
            Entfernen
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
