import { ScrollArea, Table, useMantineTheme } from '@mantine/core';
import { PatientRow } from './PatientRow';
import type { AssociationType } from '../../types/association.type';

export function PatientsTable({
  associations,
  onRowClick,
}: {
  associations: AssociationType[];
  onRowClick: (assoc: AssociationType) => void;
}) {

    const theme = useMantineTheme();

  return (
    <ScrollArea h={300}>
    <Table
      striped
      verticalSpacing="md"
      highlightOnHover
      styles={() => ({
    'th': {
      fontSize: theme.fontSizes.lg,
    },
    'td': {
      fontSize: theme.fontSizes.lg,
    },
  })}
    >
        <Table.Thead>
            <Table.Tr>
              <Table.Th>Badge</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
            </Table.Tr>
          </Table.Thead>
        <Table.Tbody>
          {associations.map((assoc) => (
            <PatientRow
              key={assoc.patient.id}
              association={assoc}
              onClick={() => onRowClick(assoc)}
            />
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
