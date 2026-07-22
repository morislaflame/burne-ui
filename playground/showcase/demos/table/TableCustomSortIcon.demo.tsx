import { useMemo, useState } from "react";
import { IoCaretUp, IoSwapVertical } from "react-icons/io5";

import { Table, type SortDescriptor } from "@/components/core/Table";

type User = { id: number; name: string; role: string; status: string };

const users: User[] = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", status: "Active" },
  { id: 2, name: "Alan Turing", role: "Research", status: "Away" },
  { id: 3, name: "Grace Hopper", role: "Lead", status: "Active" },
];

export function TableCustomSortIconDemo() {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const sortedUsers = useMemo(
    () =>
      [...users].sort((a, b) => {
        const col = sortDescriptor.column as keyof User;
        const cmp = String(a[col]).localeCompare(String(b[col]));
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }),
    [sortDescriptor],
  );

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Team (custom sort icon)"
          className="min-w-[480px]"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <Table.Header>
            <Table.Column
              allowsSorting
              isRowHeader
              id="name"
              sortIcon={({ sortDirection }) =>
                sortDirection ? (
                  <IoCaretUp
                    aria-hidden
                    className={
                      sortDirection === "descending"
                        ? "icon-xsmall rotate-180 text-primary"
                        : "icon-xsmall text-primary"
                    }
                  />
                ) : (
                  <IoSwapVertical aria-hidden className="icon-xsmall text-muted" />
                )
              }
            >
              Name
            </Table.Column>
            <Table.Column allowsSorting id="role" sortIcon={null}>
              Role
            </Table.Column>
            <Table.Column allowsSorting id="status">
              Status
            </Table.Column>
          </Table.Header>
          <Table.Body>
            {sortedUsers.map((user) => (
              <Table.Row key={user.id} id={user.id}>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell>{user.status}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
