import { useState } from "react";

import { Badge } from "@/components/core/Badge";
import { Table, type Selection } from "@/components/core/Table";
import { Text } from "@/components/core/Text";

import { STATUS_BADGE, TABLE_ROWS, type TableRow } from "../../shared/constants";

export function TableRowSelectionDemo() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<number>());
  const selectedLabel =
    selectedKeys === "all"
      ? "All"
      : (selectedKeys as Set<number>).size > 0
        ? Array.from(selectedKeys as Set<number>).join(", ")
        : "No";

  return (
    <div className="flex flex-col gap-mid">
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Team with choice"
            className="min-w-[480px]"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Role</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body items={TABLE_ROWS}>
              {(row: TableRow) => (
                <Table.Row key={row.id} id={row.id}>
                  <Table.Cell>{row.name}</Table.Cell>
                  <Table.Cell>{row.role}</Table.Cell>
                  <Table.Cell>
                    <Badge status={STATUS_BADGE[row.status]}>{row.status}</Badge>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <Text as="p" variant="small" className="text-muted">
        Selected id: <span className="font-medium text-foreground">{selectedLabel}</span>
      </Text>
    </div>
  );
}
