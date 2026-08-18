import { Table } from "@/components/core/Table";

export function TableMotionHeaderBodyDemo() {
  return (
    <Table
      className="max-w-xl"
      motion={{
        headerRow: {
          enter: (ctx) =>
            ctx.fromTo({ y: -6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.24 }),
        },
        body: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.28, delay: 0.06 },
            ),
        },
      }}
    >
      <Table.Content aria-label="Header row and body">
        <Table.Header>
          <Table.Column isRowHeader>Name</Table.Column>
          <Table.Column>Role</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="ada">
            <Table.Cell>Ada</Table.Cell>
            <Table.Cell>Engineer</Table.Cell>
          </Table.Row>
          <Table.Row id="grace">
            <Table.Cell>Grace</Table.Cell>
            <Table.Cell>Architect</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table>
  );
}
