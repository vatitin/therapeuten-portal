// // src/components/patients/MyPatients.tsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Title, Container, ScrollArea, Table, Button, Group, Space } from '@mantine/core';
// import { StatusType } from '../../constants';
// import { PatientRow } from '../common/PatientRow';
// import { HttpStatusCode } from 'axios';
// import createApiClient from '../../APIService';
// import { deletePatientWithId, patientsWithStatus, updatePatient } from '../../endpoints';
// import type { PatientType } from '../../types/patient.types';
// import { useKeycloak } from '@react-keycloak/web';

// export function MyPatients() {
//   const { patientStatus } = useParams<{ patientStatus: string }>();
//   const [patients, setPatients] = useState<PatientType[]>([]);
//   const navigate = useNavigate();
//   const { keycloak, initialized } = useKeycloak();

//   useEffect(() => {
//     if (
//       patientStatus !== StatusType.WAITING &&
//       patientStatus !== StatusType.ACTIVE
//     ) {
//       navigate('*');
//       return;
//     }
//     if (!initialized || !keycloak.authenticated || !keycloak.token) {
//       return;
//     }

//     const api = createApiClient(keycloak.token);
//     const load = async () => {
//       try {
//         const response = await api.get(patientsWithStatus(patientStatus!));
//         setPatients(response.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     load();
//   }, [patientStatus, initialized, keycloak, navigate]);

//   const handleRemove = async (
//     id: string,
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     event.stopPropagation();
//     const api = createApiClient(keycloak.token ?? '');
//     const result = await api.delete(deletePatientWithId(id));
//     if (result.status === HttpStatusCode.Ok) {
//       setPatients((prev) => prev.filter((p) => p.id !== id));
//     }
//   };

//   const handleUpdate = async (
//     id: string,
//     status: string,
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     event.stopPropagation();
//     const api = createApiClient(keycloak.token ?? '');

//     const result = await api.patch(updatePatient(id, status));
//     if (result.status === HttpStatusCode.Ok) {
//       setPatients((prev) => prev.filter((p) => p.id !== id));
//     }
//   };

//   const heading =
//     patientStatus === StatusType.WAITING
//       ? 'Meine Warteliste'
//       : 'Meine Patienten';

//   return (
//     <Container size="md">
//       <Title order={2} ta="center" mt="md" mb="md">
//         {heading}
//       </Title>

//       <ScrollArea>
//         <Table highlightOnHover striped verticalSpacing="sm">
//           <thead>
//             <tr>
//               <th>Nr.</th>
//               <th>Nachname</th>
//               <th>Vorname</th>
//               <th>Email</th>
//               <th>Handynummer</th>
//               <th>Geschlecht</th>
//               <th>Status ändern</th>
//             </tr>
//           </thead>
//           <tbody>
//             {patients.map((patient, index) => (
//               <PatientRow
//                 key={patient.id}
//                 patient={{ ...patient, sequence: index + 1 }}
//                 patientStatus={patientStatus!}
//                 onRemove={({id, event}) => handleRemove(id, event)}
//                 onUpdate={({id, status, event}) => handleUpdate(id, status, event)}
//               />
//             ))}
//           </tbody>
//         </Table>
//       </ScrollArea>

//       <Space h="md" />
//       <Group justify="center">
//         <Button
//           size="md"
//           onClick={() => navigate(`/addNewPatient/${patientStatus}`)}
//         >
//           Patient hinzufügen
//         </Button>
//       </Group>
//     </Container>
//   );
// }
