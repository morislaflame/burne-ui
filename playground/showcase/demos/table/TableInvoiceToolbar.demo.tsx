import { useState } from "react";

import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { Surface } from "@/components/core/Surface";
import { Table, type Selection } from "@/components/core/Table";
import { Text } from "@/components/core/Text";

const INVOICES = [
  { id: 1, number: "INV-1042", amount: "12 400 ₽", status: "Paid" as const },
  { id: 2, number: "INV-1043", amount: "8 900 ₽", status: "Pending" as const },
  { id: 3, number: "INV-1044", amount: "21 000 ₽", status: "Overdue" as const },
];

const STATUS_MAP = {
  Paid: "success",
  Pending: "warning",
  Overdue: "danger",
} as const;

export function TableInvoiceToolbarDemo() {
  const [selected, setSelected] = useState<Selection>(new Set<number>());

  const count = selected === "all" ? INVOICES.length : (selected as Set<number>).size;

  return (
    <div className="flex w-full max-w-xl flex-col gap-mid">
      <div className="flex items-center justify-between gap-mid">
        <Text as="span" variant="small" className="text-muted">
          Выбрано: <span className="font-medium text-foreground">{count}</span>
        </Text>
        <Button size="small" variant="outline" type="button" disabled={count === 0}>
          Экспорт
        </Button>
      </div>
      <Surface variant="secondary" padding="small">
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Счета"
              selectionMode="multiple"
              selectedKeys={selected}
              onSelectionChange={setSelected}
            >
              <Table.Header>
                <Table.Column isRowHeader>Номер</Table.Column>
                <Table.Column>Сумма</Table.Column>
                <Table.Column>Статус</Table.Column>
              </Table.Header>
              <Table.Body items={INVOICES}>
                {(row: (typeof INVOICES)[number]) => (
                  <Table.Row key={row.id} id={row.id}>
                    <Table.Cell>{row.number}</Table.Cell>
                    <Table.Cell>{row.amount}</Table.Cell>
                    <Table.Cell>
                      <Badge status={STATUS_MAP[row.status]}>{row.status}</Badge>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Surface>
    </div>
  );
}
