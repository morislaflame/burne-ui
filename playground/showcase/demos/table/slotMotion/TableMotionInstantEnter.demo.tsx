import { Table } from "@/components/core/Table";

export function TableMotionInstantEnterDemo() {
  return (
    <Table motion={{ root: { enter: false } }}>
      <Table.Content aria-label="Skip">
            <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
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
