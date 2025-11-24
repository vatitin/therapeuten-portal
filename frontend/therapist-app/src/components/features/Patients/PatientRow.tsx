import { Table, Badge, Text } from '@mantine/core';
import type { AssociationType } from '../../../types/association.type';

export function PatientRow({
  association,
  onClick,
}: {
  association: AssociationType;
  onClick(): void;
}) {

  return (
    <Table.Tr onClick={onClick} style={{ cursor: 'pointer' }}>
      <Table.Td>
        {association.patient.keycloakId && (
          <Badge color="green" variant="outline">
            registriert
          </Badge>
        )}
      </Table.Td>
      <Table.Td >
        <Text fw={500}>{association.patient.firstName} {association.patient.lastName}</Text>
      </Table.Td>
      <Table.Td>{association.patient.email}</Table.Td>
    </Table.Tr>
  );
}
