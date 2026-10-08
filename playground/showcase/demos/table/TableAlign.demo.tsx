import { Table } from "@/components/core/Table";

const rows = [
  { id: "kate", name: "Kate Moore", role: "CEO" },
  { id: "john", name: "John Smith", role: "CTO" },
  { id: "sara", name: "Sara Johnson", role: "CMO" },
];

export function TableAlignDemo() {
  return (
    <Table className="w-full">
      <Table.ScrollContainer>
        <Table.Content aria-label="Column alignment" className="min-w-[28rem]">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column className="text-center" allowsSorting>
              Role
            </Table.Column>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row.id} id={row.id}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell className="text-center">{row.role}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
