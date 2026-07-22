import { Table } from "@/components/core/Table";

const rows = [
  { id: "1", name: "Ada Lovelace", role: "Engineer" },
  { id: "2", name: "Grace Hopper", role: "Architect" },
];

export function TableColumnLabelDemo() {
  return (
    <Table className="max-w-xl">
      <Table.ScrollContainer>
        <Table.Content aria-label="Team with styled column labels">
          <Table.Header>
            <Table.HeaderRow className="bg-primary/10">
              <Table.Column isRowHeader>
                <Table.Label className="text-foreground font-semibold">Name</Table.Label>
              </Table.Column>
              <Table.Column>
                <Table.Label className="text-primary">Role</Table.Label>
              </Table.Column>
            </Table.HeaderRow>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row.id} id={row.id}>
                <Table.Cell className="font-medium">{row.name}</Table.Cell>
                <Table.Cell className="text-muted">{row.role}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
