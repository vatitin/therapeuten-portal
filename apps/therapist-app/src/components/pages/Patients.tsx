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
  Paper,
  Stack,
  Textarea,
  Drawer,
  Badge,
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
import classes from './TableScrollArea.module.css';
import type { AxiosInstance } from 'axios';
import type { AssociationType } from '../../types/association.type';
import { useDisclosure } from '@mantine/hooks';

export function Patients() {
  const { patientStatus } = useParams<{ patientStatus: string }>();
  const [associations, setAssociations] = useState<AssociationType[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);
  const [modalAction, setModalAction] = useState<'remove' | 'activate' | null>(null);
  const [modalAssociation, setModalAssociation] = useState<AssociationType | null>(null);
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();
  const [opened, { open, close }] = useDisclosure(false);
  const [activeAssociation, setActive]    = useState<AssociationType|null>(null);

  const openFor = (association: AssociationType) => {
    setActive(association);
    open();
  };

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
    if (!keycloak.authenticated) {
        keycloak.login();
        return;
    }

    async function loadPatients(token: string | null = null) {
        try {
        const apiClient: AxiosInstance = createApiClient(token);
        const res = await apiClient.get<AssociationType[]>(
            patientsWithStatus(patientStatus!)
        );
        console.log('Response status:', res.status);
        if (res.status === 200 && res.data) {
            setAssociations(res.data);
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
    if (!modalAssociation || !modalAction) return;
    const api = createApiClient(keycloak.token ?? '');
    if (modalAction === 'remove') {
      //todo actually, it is delete Association and not patient. change!
      console.log("patient", modalAssociation.patient)
      const res = await api.delete(deletePatientWithId(modalAssociation.patient.id));
      if (res.status === 200) {
        setAssociations((prev) => prev.filter((p) => p.id !== modalAssociation.patient.id));
      }
    } else {
      const res = await api.patch(
        updatePatient(modalAssociation.patient.id, StatusType.ACTIVE)
      );
      if (res.status === 200) {
        setAssociations((prev) => prev.filter((p) => p.patient.id !== modalAssociation.patient.id));
      }
    }
    setConfirmModalOpened(false);
  };

  const rows = associations.map((association) => (
    <>
    <Table.Tr
      key={association.patient.id}
      onClick={() => {openFor(association)}}
      style={{ cursor: 'pointer' }}
    >
      {association.patient.keycloakId ? (
        <Table.Td>        
          <Badge/>
        </Table.Td>
      ) : (
        <Table.Td>
        </Table.Td>
      )}

      <Table.Td>
        {association.patient.firstName ?? ''} {association.patient.lastName ?? ''}
      </Table.Td>
      <Table.Td>{association.patient.email}</Table.Td>
    </Table.Tr>


      </>
  )
);


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
              <Table.Th>Badge</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
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

      <Drawer opened={opened} onClose={close} title="Patient" size="lg" overlayProps={{ backgroundOpacity: 0.1, blur: 0.5 }}>
        <Container size="xs">
          <Stack gap="xs">
            <Paper 
              shadow="xl" 
              radius="sm" 
              withBorder p="md"
            >
              <Text fw={500}>
                    {activeAssociation?.patient.firstName} {activeAssociation?.patient.lastName}
              </Text>
            </Paper>

            {activeAssociation?.applicationText && (
              <Paper 
                shadow="xl" 
                radius="sm" 
                withBorder p="md"
              >
                <Text fw={500}>
                  {activeAssociation?.applicationText}
                </Text>
              </Paper>
            )}

            <Textarea
              label="Kommentar"
              placeholder="Termin vereinbaren..."
              autosize
              variant="filled"
              minRows={6}
              maxRows={10}
              //value={applicationText} 
              //onChange={e => setApplicationText(e.currentTarget.value)}
            />

            <Group gap="xs">
              <ActionIcon
                onClick={(e) => {
                  e.stopPropagation();
                  setModalAssociation(activeAssociation);
                  setModalAction('activate');
                  setConfirmModalOpened(true);
                }}
                title="Auf Aktiv setzen"
              >
                <IconCheck size={18} />
              </ActionIcon>
              <ActionIcon
                color="red"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalAssociation(activeAssociation);
                  setModalAction('remove');
                  setConfirmModalOpened(true);
                }}
                 
                title="Entfernen"
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Group>
          </Stack>
        </Container>

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
          {modalAssociation?.patient
            ? `: ${modalAssociation?.patient.firstName} ${modalAssociation.patient.lastName}`
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
      </Drawer>
    </Container>
  );
}
