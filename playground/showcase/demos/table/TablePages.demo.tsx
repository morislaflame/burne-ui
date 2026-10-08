import { useMemo, useState } from "react";

import { Pagination } from "@/components/core/Pagination";
import { Table } from "@/components/core/Table";

const ROWS = [
  { id: "kate", name: "Kate Moore", role: "CEO" },
  { id: "john", name: "John Smith", role: "CTO" },
  { id: "sara", name: "Sara Johnson", role: "CMO" },
  { id: "michael", name: "Michael Brown", role: "CFO" },
  { id: "emily", name: "Emily Davis", role: "Product" },
  { id: "davis", name: "Davis Wilson", role: "Design" },
  { id: "olivia", name: "Olivia Martinez", role: "Frontend" },
  { id: "james", name: "James Taylor", role: "Backend" },
];

const PAGE_SIZE = 3;

export function TablePagesDemo() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(ROWS.length / PAGE_SIZE);
  const visible = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return ROWS.slice(start, start + PAGE_SIZE);
  }, [page]);
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, ROWS.length);

  return (
    <Table className="w-full">
      <Table.ScrollContainer>
        <Table.Content aria-label="Team pages" className="min-w-[28rem]">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
          </Table.Header>
          <Table.Body>
            {visible.map((row) => (
              <Table.Row key={row.id} id={row.id}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.role}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      <Table.Footer>
        <Pagination className="flex-nowrap" page={page} totalPages={totalPages} onPageChange={setPage}>
          <Pagination.Summary>
            {from}–{to} of {ROWS.length}
          </Pagination.Summary>
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous />
            </Pagination.Item>
            <Pagination.Pages />
            <Pagination.Item>
              <Pagination.Next />
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </Table.Footer>
    </Table>
  );
}
