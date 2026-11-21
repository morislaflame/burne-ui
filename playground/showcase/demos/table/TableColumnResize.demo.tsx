import { Table } from "@/components/core/Table";

const rows = [
  { id: "kate", name: "Kate Moore", role: "CEO" },
  { id: "john", name: "John Smith", role: "CTO" },
];

export function TableColumnResizeDemo() {
  return (
    <Table columnResize className="w-full">
      <Table.ScrollContainer>
        <Table.Content aria-label="Resizable columns" className="min-w-[28rem]">
          <Table.Header>
            <Table.Column id="name" rowHeader>
              Name
            </Table.Column>
            <Table.Column id="role">Role</Table.Column>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row.id} id={row.id}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.role}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
