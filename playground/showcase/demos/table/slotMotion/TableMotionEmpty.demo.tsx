import { Table } from "@/components/core/Table";

export function TableMotionEmptyDemo() {
  return (
    <Table
      className="max-w-xl"
      motion={{
        empty: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.28, delay: 0.04 },
            ),
        },
      }}
    >
      <Table.Content aria-label="Empty members">
        <Table.Header>
          <Table.Column isRowHeader>Name</Table.Column>
          <Table.Column>Role</Table.Column>
        </Table.Header>
        <Table.Body
          items={[]}
          renderEmptyState={() => <Table.Empty>No members yet.</Table.Empty>}
        />
      </Table.Content>
    </Table>
  );
}
