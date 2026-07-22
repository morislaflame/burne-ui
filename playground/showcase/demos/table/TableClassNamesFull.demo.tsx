import { Table } from "@/components/core/Table";

const rows = [
  { id: 1, name: "Kate Moore", role: "CEO" },
  { id: 2, name: "John Smith", role: "CTO" },
  { id: 3, name: "Sara Johnson", role: "CMO" },
];

export function TableClassNamesFullDemo() {
  return (
    <Table
      classNames={{
        root: "rounded-mid border border-info/25 shadow-token-base",
        headerRow: "bg-info/10",
        column: "text-info font-semibold",
        row: "hover:bg-info/5",
        cell: "text-foreground/90",
        footer: "bg-info/5",
      }}
      className="max-w-2xl"
    >
      <Table.ScrollContainer>
        <Table.Content aria-label="Team">
          <Table.Header>
            <Table.HeaderRow className="bg-info/15">
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Role</Table.Column>
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
      <Table.Footer>
        <span className="text-small text-muted">Setting up slots via classNames on root.</span>
      </Table.Footer>
    </Table>
  );
}
