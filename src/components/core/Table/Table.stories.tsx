import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoCaretUp, IoSwapVertical } from "react-icons/io5";

import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { Pagination } from "@/components/core/Pagination";

import { Table, type Selection, type SortDescriptor, type TableRowTone } from ".";

// ─── shared data ─────────────────────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  role: string;
  status: "Active" | "Inactive" | "On Leave";
  email: string;
}

const users: User[] = [
  { id: 1, name: "Kate Moore",      role: "CEO",               status: "Active",   email: "kate@acme.com"    },
  { id: 2, name: "John Smith",      role: "CTO",               status: "Active",   email: "john@acme.com"    },
  { id: 3, name: "Sara Johnson",    role: "CMO",               status: "On Leave", email: "sara@acme.com"    },
  { id: 4, name: "Michael Brown",   role: "CFO",               status: "Active",   email: "michael@acme.com" },
  { id: 5, name: "Emily Davis",     role: "Product Manager",   status: "Inactive", email: "emily@acme.com"   },
  { id: 6, name: "Davis Wilson",    role: "Lead Designer",     status: "Active",   email: "davis@acme.com"   },
  { id: 7, name: "Olivia Martinez", role: "Frontend Engineer", status: "Active",   email: "olivia@acme.com"  },
  { id: 8, name: "James Taylor",    role: "Backend Engineer",  status: "Active",   email: "james@acme.com"   },
];

const statusBadgeColor: Record<User["status"], "success" | "danger" | "warning"> = {
  Active:     "success",
  Inactive:   "danger",
  "On Leave": "warning",
};

const statusRowTone: Record<User["status"], TableRowTone> = {
  Active:     "success",
  Inactive:   "danger",
  "On Leave": "warning",
};

// ─── decorator ───────────────────────────────────────────────────────────────

const decorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex w-full flex-col items-start p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="w-full max-w-4xl">
        <Story />
      </div>
    </div>
  ),
];

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: "Core Components/Table",
  tags: ["autodocs"],
  decorators: decorator,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Table for structured data. Supports sorting, row selection, pagination, and custom cells.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// ─── stories ─────────────────────────────────────────────────────────────────

export const Basic: Story = {
  name: "Basic",
  render: () => (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Team" className="min-w-[600px]">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Email</Table.Column>
          </Table.Header>
          <Table.Body items={users}>
            {(user: User) => (
              <Table.Row key={user.id} id={user.id}>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell>{user.status}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  ),
};

export const SecondaryVariant: Story = {
  name: "Secondary variant",
  render: () => (
    <Table variant="secondary">
      <Table.ScrollContainer>
        <Table.Content aria-label="Team (secondary)" className="min-w-[600px]">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Email</Table.Column>
          </Table.Header>
          <Table.Body items={users}>
            {(user: User) => (
              <Table.Row key={user.id} id={user.id}>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell>{user.status}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  ),
};

export const Sorting: Story = {
  name: "Sorting",
  render: function SortingStory() {
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
            aria-label="Team (sorting)"
            className="min-w-[600px]"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <Table.Header>
              <Table.Column allowsSorting isRowHeader id="name">
                Name
              </Table.Column>
              <Table.Column allowsSorting id="role">
                Role
              </Table.Column>
              <Table.Column allowsSorting id="status">
                Status
              </Table.Column>
              <Table.Column allowsSorting id="email">
                Email
              </Table.Column>
            </Table.Header>
            <Table.Body>
              {sortedUsers.map((user) => (
                <Table.Row key={user.id} id={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>{user.status}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const nameSort = canvas.getByRole("button", { name: /Name/ });
    await userEvent.click(nameSort);
    const nameHeader = canvas.getByRole("rowheader", { name: /Name/ });
    await expect(nameHeader).toHaveAttribute("aria-sort", "descending");
  },
};

export const CustomSortIcon: Story = {
  name: "Custom sort icon",
  parameters: {
    docs: {
      description: {
        story:
          "`Table.Column` `sortIcon` replaces the default chevron. Render prop receives `sortDirection`. Pass `null` to hide.",
      },
    },
  },
  render: function CustomSortIconStory() {
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
            className="min-w-[600px]"
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
              <Table.Column allowsSorting id="email">
                Email
              </Table.Column>
            </Table.Header>
            <Table.Body>
              {sortedUsers.map((user) => (
                <Table.Row key={user.id} id={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>{user.status}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    );
  },
};

export const UncontrolledSorting: Story = {
  name: "Uncontrolled sorting (defaultSortDescriptor)",
  parameters: {
    docs: {
      description: {
        story:
          "`defaultSortDescriptor` owns header sort state. `onSortChange` syncs row order without controlled `sortDescriptor`.",
      },
    },
  },
  render: function UncontrolledSortingStory() {
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
            aria-label="Team (uncontrolled sorting)"
            className="min-w-[600px]"
            defaultSortDescriptor={{ column: "name", direction: "ascending" }}
            onSortChange={setSortDescriptor}
          >
            <Table.Header>
              <Table.Column allowsSorting isRowHeader id="name">
                Name
              </Table.Column>
              <Table.Column allowsSorting id="role">
                Role
              </Table.Column>
              <Table.Column allowsSorting id="status">
                Status
              </Table.Column>
              <Table.Column allowsSorting id="email">
                Email
              </Table.Column>
            </Table.Header>
            <Table.Body>
              {sortedUsers.map((user) => (
                <Table.Row key={user.id} id={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>{user.status}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    );
  },
};

export const ClickToSelect: Story = {
  name: "Row selection (click)",
  render: function ClickToSelectStory() {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<number>());

    const selectedLabel =
      selectedKeys === "all"
        ? "All"
        : (selectedKeys as Set<number>).size > 0
          ? Array.from(selectedKeys as Set<number>).join(", ")
          : "None";

    return (
      <div className="flex flex-col gap-base">
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Team (click selection)"
              className="min-w-[600px]"
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              <Table.Header>
                <Table.Column isRowHeader>Name</Table.Column>
                <Table.Column>Role</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Email</Table.Column>
              </Table.Header>
              <Table.Body>
                {users.map((user) => (
                  <Table.Row key={user.id} id={user.id}>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>{user.status}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
        <p className="text-small text-muted">
          Selected: <span className="font-medium text-foreground">{selectedLabel}</span>
        </p>
      </div>
    );
  },
};

export const UncontrolledSelection: Story = {
  name: "Uncontrolled selection (defaultSelectedKeys)",
  parameters: {
    docs: {
      description: {
        story:
          "`defaultSelectedKeys` owns selection. Optional `onSelectionChange` observes without controlled `selectedKeys`.",
      },
    },
  },
  render: function UncontrolledSelectionStory() {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([2, 4]));

    const selectedLabel =
      selectedKeys === "all"
        ? "All"
        : (selectedKeys as Set<number>).size > 0
          ? Array.from(selectedKeys as Set<number>).join(", ")
          : "None";

    return (
      <div className="flex flex-col gap-base">
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Team (uncontrolled selection)"
              className="min-w-[600px]"
              selectionMode="multiple"
              defaultSelectedKeys={new Set([2, 4])}
              onSelectionChange={setSelectedKeys}
            >
              <Table.Header>
                <Table.Column isRowHeader>Name</Table.Column>
                <Table.Column>Role</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Email</Table.Column>
              </Table.Header>
              <Table.Body>
                {users.map((user) => (
                  <Table.Row key={user.id} id={user.id}>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>{user.status}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
        <p className="text-small text-muted">
          Reported: <span className="font-medium text-foreground">{selectedLabel}</span>
        </p>
      </div>
    );
  },
};

export const CheckboxSelection: Story = {
  name: "Row selection (checkboxes)",
  render: function CheckboxSelectionStory() {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const allSelected = selectedIds.size === users.length;

    const toggleAll = () => {
      setSelectedIds(allSelected ? new Set() : new Set(users.map((u) => u.id)));
    };

    const toggleRow = (id: number) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    };

    return (
      <div className="flex flex-col gap-base">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Team (checkboxes)" className="min-w-[640px]">
              <Table.Header>
                <Table.Column className="w-10 pr-0">
                  <Checkbox
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all"
                  >
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                  </Checkbox>
                </Table.Column>
                <Table.Column isRowHeader>Name</Table.Column>
                <Table.Column>Role</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Email</Table.Column>
              </Table.Header>
              <Table.Body>
                {users.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell className="pr-0" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(user.id)}
                        onChange={() => toggleRow(user.id)}
                        aria-label={`Select ${user.name}`}
                        variant="secondary"
                      >
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox>
                    </Table.Cell>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>{user.status}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
        <p className="text-small text-muted">
          Selected:{" "}
          <span className="font-medium text-foreground">
            {selectedIds.size > 0 ? Array.from(selectedIds).join(", ") : "None"}
          </span>
        </p>
      </div>
    );
  },
};

export const CustomCells: Story = {
  name: "Custom cells",
  render: function CustomCellsStory() {
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
            aria-label="Team (custom cells)"
            className="min-w-[720px]"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <Table.Header>
              <Table.Column allowsSorting isRowHeader id="name">
                Name
              </Table.Column>
              <Table.Column allowsSorting id="role">
                Role
              </Table.Column>
              <Table.Column allowsSorting id="status">
                Status
              </Table.Column>
              <Table.Column>Email</Table.Column>
              <Table.Column className="text-end">Actions</Table.Column>
            </Table.Header>
            <Table.Body>
              {sortedUsers.map((user) => (
                <Table.Row key={user.id} id={user.id}>
                  <Table.Cell className="font-medium">{user.name}</Table.Cell>
                  <Table.Cell className="text-muted">{user.role}</Table.Cell>
                  <Table.Cell>
                    <Badge status={statusBadgeColor[user.status]} size="small">
                      {user.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-muted">{user.email}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-end gap-xsmall">
                      <Button iconOnly size="small" variant="ghost">
                        <span className="text-muted text-small">✎</span>
                      </Button>
                      <Button iconOnly size="small" variant="primary" status="danger">
                        <span className="text-small">✕</span>
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    );
  },
};

export const WithPagination: Story = {
  name: "With pagination",
  render: function WithPaginationStory() {
    const ROWS_PER_PAGE = 4;
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(users.length / ROWS_PER_PAGE);

    const paginatedUsers = useMemo(() => {
      const start = (page - 1) * ROWS_PER_PAGE;
      return users.slice(start, start + ROWS_PER_PAGE);
    }, [page]);

    const start = (page - 1) * ROWS_PER_PAGE + 1;
    const end = Math.min(page * ROWS_PER_PAGE, users.length);

    return (
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Team with pagination" className="min-w-[600px]">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Role</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Email</Table.Column>
            </Table.Header>
            <Table.Body>
              {paginatedUsers.map((user) => (
                <Table.Row key={user.id} id={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>{user.status}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        <Table.Footer>
          <span className="text-small text-muted">
            {start}–{end} of {users.length}
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} siblingCount={1}>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <Pagination.PreviousIcon />
                  Back
                </Pagination.Previous>
              </Pagination.Item>
              <Pagination.Pages />
              <Pagination.Item>
                <Pagination.Next
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </Table.Footer>
      </Table>
    );
  },
};

export const EmptyState: Story = {
  name: "Empty state",
  render: () => (
    <Table className="min-h-[200px]">
      <Table.ScrollContainer>
        <Table.Content aria-label="Empty table" className="min-w-[600px] h-full">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Email</Table.Column>
          </Table.Header>
          <Table.Body
            items={[]}
            renderEmptyState={() => (
              <div className="flex flex-col items-center justify-center gap-small py-2xlarge text-center">
                <span className="text-2xl">📭</span>
                <span className="text-small text-muted">No data found</span>
              </div>
            )}
          />
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  ),
};

export const StickyHeader: Story = {
  name: "Sticky header (scroll)",
  render: function StickyHeaderStory() {
    const manyUsers = [...users, ...users, ...users];

    return (
      <Table>
        <Table.ScrollContainer className="h-64 overflow-y-auto">
          <Table.Content aria-label="Team (scroll)" className="min-w-[600px]">
            <Table.Header className="sticky top-0 z-10">
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Role</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Email</Table.Column>
            </Table.Header>
            <Table.Body>
              {manyUsers.map((user, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Table.Row key={`${user.id}-${i}`}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>{user.status}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    );
  },
};

export const TonedRows: Story = {
  name: "Toned rows",
  render: () => (
    <Table variant="toned">
      <Table.ScrollContainer>
        <Table.Content aria-label="Team (toned rows)" className="min-w-[600px]">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Email</Table.Column>
          </Table.Header>
          <Table.Body>
            {users.map((user) => (
              <Table.Row key={user.id} id={user.id} tone={statusRowTone[user.status]}>
                <Table.Cell className="font-medium">{user.name}</Table.Cell>
                <Table.Cell className="text-muted">{user.role}</Table.Cell>
                <Table.Cell>
                  <Badge status={statusBadgeColor[user.status]} size="small">
                    {user.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-muted">{user.email}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  ),
};

const toneLabels: { tone: TableRowTone; label: string }[] = [
  { tone: "default", label: "Default" },
  { tone: "secondary", label: "Secondary" },
  { tone: "outline", label: "Outline" },
  { tone: "success", label: "Success" },
  { tone: "info", label: "Info" },
  { tone: "warning", label: "Warning" },
  { tone: "danger", label: "Danger" },
];

export const TonedRowsAllTones: Story = {
  name: "All row tones",
  render: () => (
    <Table variant="toned">
      <Table.ScrollContainer>
        <Table.Content aria-label="All row tones" className="min-w-[480px]">
          <Table.Header>
            <Table.Column isRowHeader>Tone</Table.Column>
            <Table.Column>Description</Table.Column>
          </Table.Header>
          <Table.Body>
            {toneLabels.map(({ tone, label }) => (
              <Table.Row key={tone} tone={tone}>
                <Table.Cell className="font-medium">{label}</Table.Cell>
                <Table.Cell className="text-muted">
                  <code className="text-small">tone=&quot;{tone}&quot;</code>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  ),
};

export const TonedRowsWithSelection: Story = {
  name: "Toned rows + selection",
  render: function TonedRowsWithSelectionStory() {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<number>());

    return (
      <div className="flex flex-col gap-base">
        <Table variant="toned">
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Toned rows with selection"
              className="min-w-[600px]"
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              <Table.Header>
                <Table.Column isRowHeader>Name</Table.Column>
                <Table.Column>Role</Table.Column>
                <Table.Column>Status</Table.Column>
              </Table.Header>
              <Table.Body>
                {users.slice(0, 5).map((user) => (
                  <Table.Row key={user.id} id={user.id} tone={statusRowTone[user.status]}>
                    <Table.Cell className="font-medium">{user.name}</Table.Cell>
                    <Table.Cell className="text-muted">{user.role}</Table.Cell>
                    <Table.Cell>{user.status}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
        <p className="text-small text-muted">
          Click a row to select. Selected:{" "}
          <span className="font-medium text-foreground">
            {(selectedKeys as Set<number>).size > 0
              ? Array.from(selectedKeys as Set<number>).join(", ")
              : "None"}
          </span>
        </p>
      </div>
    );
  },
};

export const Gloss: Story = {
  name: "Gloss",
  render: () => (
    <div className="flex flex-col gap-base">
      <Table variant="gloss" className="w-full">
        <Table.ScrollContainer>
          <Table.Content aria-label="Gloss team" className="min-w-[600px]">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Role</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Email</Table.Column>
            </Table.Header>
            <Table.Body>
              {users.slice(0, 6).map((user) => (
                <Table.Row key={user.id} id={user.id}>
                  <Table.Cell className="font-medium">{user.name}</Table.Cell>
                  <Table.Cell className="text-muted">{user.role}</Table.Cell>
                  <Table.Cell>
                    <Badge status={statusBadgeColor[user.status]} size="small">
                      {user.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-muted">{user.email}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <p className="text-small text-muted">
        Hover a row — <span className="text-foreground">primary-tint</span> highlight.
      </p>
    </div>
  ),
};

export const GlossWithSelection: Story = {
  name: "Gloss + selection",
  render: function GlossWithSelectionStory() {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<number>([2, 4]));

    const selectedLabel =
      selectedKeys === "all"
        ? "All"
        : (selectedKeys as Set<number>).size > 0
          ? Array.from(selectedKeys as Set<number>).join(", ")
          : "None";

    return (
      <div className="flex flex-col gap-base">
        <Table variant="gloss" className="w-full">
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Gloss team with selection"
              className="min-w-[600px]"
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              <Table.Header>
                <Table.Column isRowHeader>Name</Table.Column>
                <Table.Column>Role</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Email</Table.Column>
              </Table.Header>
              <Table.Body>
                {users.slice(0, 6).map((user) => (
                  <Table.Row key={user.id} id={user.id}>
                    <Table.Cell className="font-medium">{user.name}</Table.Cell>
                    <Table.Cell className="text-muted">{user.role}</Table.Cell>
                    <Table.Cell>
                      <Badge status={statusBadgeColor[user.status]} size="small">
                        {user.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="text-muted">{user.email}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
        <p className="text-small text-muted">
          Hover and selection — <span className="text-foreground">primary-tint</span>. Selected:{" "}
          <span className="font-medium text-foreground">{selectedLabel}</span>
        </p>
      </div>
    );
  },
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Table (compound API)",
      },
    },
  },
  render: () => (
    <Table
      classNames={{
        root: "rounded-mid border border-info/25 shadow-token-base",
        headerRow: "bg-info/10",
        column: "text-info font-semibold",
        row: "hover:bg-info/5",
        cell: "text-foreground/90",
        footer: "bg-info/5",
      }}
      className="max-w-2xl"
    >
      <Table.ScrollContainer>
        <Table.Content aria-label="Team">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
          </Table.Header>
          <Table.Body>
            {users.slice(0, 3).map((user) => (
              <Table.Row key={user.id} id={user.id}>
                <Table.Cell className="font-medium">{user.name}</Table.Cell>
                <Table.Cell className="text-muted">{user.role}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      <Table.Footer>
        <span className="text-small text-muted">All slots configured via classNames.</span>
      </Table.Footer>
    </Table>
  ),
};

/** Review 3.9: `Table.HeaderRow` accepts className / ref. */
export const HeaderRow: Story = {
  name: "HeaderRow + Label",
  parameters: {
    docs: {
      description: {
        story:
          "`Table.HeaderRow` is an optional compound part. Style header text via `Table.Label` (or `classNames.columnLabel`). Plain Column children are wrapped in Label automatically.",
      },
    },
  },
  render: () => (
    <Table className="max-w-2xl">
      <Table.ScrollContainer>
        <Table.Content aria-label="Team with custom header row">
          <Table.Header>
            <Table.HeaderRow className="bg-primary/10">
              <Table.Column isRowHeader className="text-left">
                <Table.Label className="text-foreground font-semibold text-mid">Name</Table.Label>
              </Table.Column>
              <Table.Column className="text-left">
                <Table.Label className="text-primary text-mid">Role</Table.Label>
              </Table.Column>
            </Table.HeaderRow>
          </Table.Header>
          <Table.Body>
            {users.slice(0, 3).map((user) => (
              <Table.Row key={user.id} id={user.id}>
                <Table.Cell className="font-medium">{user.name}</Table.Cell>
                <Table.Cell className="text-muted">{user.role}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  ),
};
