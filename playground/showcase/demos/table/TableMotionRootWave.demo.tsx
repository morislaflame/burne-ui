import { Table } from "@/components/core/Table";

export function TableMotionRootWaveDemo() {
  return (
    <Table
      motion={{
        root: {
          enter: (ctx) =>
            ctx.fromTo({ opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.32 }),
        },
        content: {
          enter: (ctx) => ctx.fromTo({ y: 6 }, { y: 0, duration: 0.24 }),
        },
      }}
    >
      <Table.Content aria-label="Wave">
        <Table.Header>
          <Table.Column isRowHeader>Name</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Ada</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table>
  );
}
