import { Table } from "@/components/core/Table";

const rows = Array.from({ length: 200 }, (_, index) => ({
  id: String(index + 1),
  name: `Row ${index + 1}`,
  role: index % 2 === 0 ? "Design" : "Engineering",
}));

export function TableVirtualizedDemo() {
  return (
    <Table>
      <Table.ScrollContainer className="overflow-y-auto" style={{ maxHeight: "min(16rem, 50dvh)" }}>
        <Table.Content aria-label="Rows">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
          </Table.Header>
          <Table.Body virtualized items={rows}>
            {(row) => (
              <Table.Row id={row.id}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.role}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
