import { Badge } from "@/components/core/Badge";
import { Table } from "@/components/core/Table";

const RECENT = [
  { id: 1, event: "Deploy v1.2", env: "production", time: "2 min" },
  { id: 2, event: "Preview build", env: "staging", time: "18 min" },
  { id: 3, event: "Rollback", env: "production", time: "1 h" },
] as const;

export function TableActivityFeedDemo() {
  return (
    <Table variant="toned" className="w-full max-w-lg">
      <Table.ScrollContainer>
        <Table.Content aria-label="Activity">
          <Table.Header>
            <Table.Column isRowHeader>Event</Table.Column>
            <Table.Column>Environment</Table.Column>
            <Table.Column>Time</Table.Column>
          </Table.Header>
          <Table.Body items={[...RECENT]}>
            {(row) => (
              <Table.Row key={row.id} id={row.id}>
                <Table.Cell>{row.event}</Table.Cell>
                <Table.Cell>
                  <Badge variant="secondary" size="small">
                    {row.env}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-muted">{row.time}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
