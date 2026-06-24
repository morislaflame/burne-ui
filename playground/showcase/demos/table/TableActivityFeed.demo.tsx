import { Badge } from "@/components/core/Badge";
import { Table } from "@/components/core/Table";

const RECENT = [
  { id: 1, event: "Деплой v1.2", env: "production", time: "2 мин" },
  { id: 2, event: "Preview build", env: "staging", time: "18 мин" },
  { id: 3, event: "Rollback", env: "production", time: "1 ч" },
] as const;

export function TableActivityFeedDemo() {
  return (
    <Table variant="toned" className="w-full max-w-lg">
      <Table.ScrollContainer>
        <Table.Content aria-label="Активность">
          <Table.Header>
            <Table.Column isRowHeader>Событие</Table.Column>
            <Table.Column>Окружение</Table.Column>
            <Table.Column>Время</Table.Column>
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
