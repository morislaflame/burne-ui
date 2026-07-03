import { Badge } from "@/components/core/Badge";
import { Table } from "@/components/core/Table";

import { STATUS_BADGE, TABLE_ROWS, type TableRow } from "../../shared/constants";

export function TableBasicDemo() {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Team" className="min-w-[480px]">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body items={TABLE_ROWS}>
            {(row: TableRow) => (
              <Table.Row key={row.id} id={row.id}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.role}</Table.Cell>
                <Table.Cell>
                  <Badge status={STATUS_BADGE[row.status]}>{row.status}</Badge>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
