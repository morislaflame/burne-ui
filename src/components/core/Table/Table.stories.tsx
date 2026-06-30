import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoChevronUp } from "react-icons/io5";

import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { Pagination } from "@/components/core/Pagination";
import { cn } from "@/utils/cn";

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

// ─── sortable column header helper ───────────────────────────────────────────

function SortableHeader({
  children,
  sortDirection,
}: {
  children: React.ReactNode;
  sortDirection?: "ascending" | "descending";
}) {
  return (
    <span className="inline-flex w-full items-center justify-between gap-xsmall">
      <span>{children}</span>
      {sortDirection && (
        <IoChevronUp
          aria-hidden
          className={cn(
            "icon-xsmall shrink-0",
            sortDirection === "descending" && "rotate-180",
          )}
        />
      )}
    </span>
  );
}

// ─── decorator ───────────────────────────────────────────────────────────────

const decorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex w-full flex-col items-start p-xlarge text-foreground"
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
          "Таблица для отображения структурированных данных. Поддерживает сортировку, выбор строк, пагинацию и кастомные ячейки.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// ─── stories ─────────────────────────────────────────────────────────────────

export const Basic: Story = {
  name: "Базовая",
  render: () => (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Команда" className="min-w-[600px]">
          <Table.Header>
            <Table.Column isRowHeader>Имя</Table.Column>
            <Table.Column>Роль</Table.Column>
            <Table.Column>Статус</Table.Column>
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
  name: "Вторичный вариант",
  render: () => (
    <Table variant="secondary">
      <Table.ScrollContainer>
        <Table.Content aria-label="Команда (secondary)" className="min-w-[600px]">
          <Table.Header>
            <Table.Column isRowHeader>Имя</Table.Column>
            <Table.Column>Роль</Table.Column>
            <Table.Column>Статус</Table.Column>
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
  name: "Сортировка",
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
            aria-label="Команда (сортировка)"
            className="min-w-[600px]"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <Table.Header>
              <Table.Column allowsSorting isRowHeader id="name">
                {({ sortDirection }) => (
                  <SortableHeader sortDirection={sortDirection}>Имя</SortableHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="role">
                {({ sortDirection }) => (
                  <SortableHeader sortDirection={sortDirection}>Роль</SortableHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="status">
                {({ sortDirection }) => (
                  <SortableHeader sortDirection={sortDirection}>Статус</SortableHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="email">
                {({ sortDirection }) => (
                  <SortableHeader sortDirection={sortDirection}>Email</SortableHeader>
                )}
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
    const nameHeader = canvas.getByRole("rowheader", { name: /Имя/ });
    await userEvent.click(nameHeader);
    await expect(nameHeader).toHaveAttribute("aria-sort", "descending");
  },
};

export const ClickToSelect: Story = {
  name: "Выбор строк (клик)",
  render: function ClickToSelectStory() {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<number>());

    const selectedLabel =
      selectedKeys === "all"
        ? "Все"
        : (selectedKeys as Set<number>).size > 0
          ? Array.from(selectedKeys as Set<number>).join(", ")
          : "Нет";

    return (
      <div className="flex flex-col gap-base">
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Команда (выбор кликом)"
              className="min-w-[600px]"
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              <Table.Header>
                <Table.Column isRowHeader>Имя</Table.Column>
                <Table.Column>Роль</Table.Column>
                <Table.Column>Статус</Table.Column>
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
          Выбрано: <span className="font-medium text-foreground">{selectedLabel}</span>
        </p>
      </div>
    );
  },
};

export const CheckboxSelection: Story = {
  name: "Выбор строк (чекбоксы)",
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
            <Table.Content aria-label="Команда (чекбоксы)" className="min-w-[640px]">
              <Table.Header>
                <Table.Column className="w-10 pr-0">
                  <Checkbox
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Выбрать всех"
                  >
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                  </Checkbox>
                </Table.Column>
                <Table.Column isRowHeader>Имя</Table.Column>
                <Table.Column>Роль</Table.Column>
                <Table.Column>Статус</Table.Column>
                <Table.Column>Email</Table.Column>
              </Table.Header>
              <Table.Body>
                {users.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell className="pr-0" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(user.id)}
                        onChange={() => toggleRow(user.id)}
                        aria-label={`Выбрать ${user.name}`}
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
          Выбрано:{" "}
          <span className="font-medium text-foreground">
            {selectedIds.size > 0 ? Array.from(selectedIds).join(", ") : "Нет"}
          </span>
        </p>
      </div>
    );
  },
};

export const CustomCells: Story = {
  name: "Кастомные ячейки",
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
            aria-label="Команда (кастомные ячейки)"
            className="min-w-[720px]"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <Table.Header>
              <Table.Column allowsSorting isRowHeader id="name">
                {({ sortDirection }) => (
                  <SortableHeader sortDirection={sortDirection}>Имя</SortableHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="role">
                {({ sortDirection }) => (
                  <SortableHeader sortDirection={sortDirection}>Роль</SortableHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="status">
                {({ sortDirection }) => (
                  <SortableHeader sortDirection={sortDirection}>Статус</SortableHeader>
                )}
              </Table.Column>
              <Table.Column>Email</Table.Column>
              <Table.Column className="text-end">Действия</Table.Column>
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
  name: "С пагинацией",
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
          <Table.Content aria-label="Команда с пагинацией" className="min-w-[600px]">
            <Table.Header>
              <Table.Column isRowHeader>Имя</Table.Column>
              <Table.Column>Роль</Table.Column>
              <Table.Column>Статус</Table.Column>
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
            {start}–{end} из {users.length}
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} siblingCount={1}>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <Pagination.PreviousIcon />
                  Назад
                </Pagination.Previous>
              </Pagination.Item>
              <Pagination.Pages />
              <Pagination.Item>
                <Pagination.Next
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Вперёд
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
  name: "Пустое состояние",
  render: () => (
    <Table className="min-h-[200px]">
      <Table.ScrollContainer>
        <Table.Content aria-label="Пустая таблица" className="min-w-[600px] h-full">
          <Table.Header>
            <Table.Column isRowHeader>Имя</Table.Column>
            <Table.Column>Роль</Table.Column>
            <Table.Column>Статус</Table.Column>
            <Table.Column>Email</Table.Column>
          </Table.Header>
          <Table.Body
            items={[]}
            renderEmptyState={() => (
              <div className="flex flex-col items-center justify-center gap-small py-xlarge text-center">
                <span className="text-2xl">📭</span>
                <span className="text-small text-muted">Данные не найдены</span>
              </div>
            )}
          />
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  ),
};

export const StickyHeader: Story = {
  name: "Фиксированный заголовок (скролл)",
  render: function StickyHeaderStory() {
    const manyUsers = [...users, ...users, ...users];

    return (
      <Table>
        <Table.ScrollContainer className="h-64 overflow-y-auto">
          <Table.Content aria-label="Команда (скролл)" className="min-w-[600px]">
            <Table.Header className="sticky top-0 z-10">
              <Table.Column isRowHeader>Имя</Table.Column>
              <Table.Column>Роль</Table.Column>
              <Table.Column>Статус</Table.Column>
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
  name: "Строки с тонами",
  render: () => (
    <Table variant="toned">
      <Table.ScrollContainer>
        <Table.Content aria-label="Команда (тонированные строки)" className="min-w-[600px]">
          <Table.Header>
            <Table.Column isRowHeader>Имя</Table.Column>
            <Table.Column>Роль</Table.Column>
            <Table.Column>Статус</Table.Column>
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
  name: "Все тоны строк",
  render: () => (
    <Table variant="toned">
      <Table.ScrollContainer>
        <Table.Content aria-label="Все тоны строк" className="min-w-[480px]">
          <Table.Header>
            <Table.Column isRowHeader>Тон</Table.Column>
            <Table.Column>Описание</Table.Column>
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
  name: "Тонированные строки + выбор",
  render: function TonedRowsWithSelectionStory() {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<number>());

    return (
      <div className="flex flex-col gap-base">
        <Table variant="toned">
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Тонированные строки с выбором"
              className="min-w-[600px]"
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              <Table.Header>
                <Table.Column isRowHeader>Имя</Table.Column>
                <Table.Column>Роль</Table.Column>
                <Table.Column>Статус</Table.Column>
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
          Клик по строке для выбора. Выбрано:{" "}
          <span className="font-medium text-foreground">
            {(selectedKeys as Set<number>).size > 0
              ? Array.from(selectedKeys as Set<number>).join(", ")
              : "Нет"}
          </span>
        </p>
      </div>
    );
  },
};

export const CustomClassNames: Story = {
  name: "Полная кастомизация classNames",
  parameters: {
    docs: {
      description: {
        story: "кастомизация classNames для Table (compound API)",
      },
    },
  },
  render: () => (
    <Table
      classNames={{
        root: "rounded-mid border border-info/25 shadow-token-sm",
        headerRow: "bg-info/10",
        column: "text-info font-semibold",
        row: "hover:bg-info/5",
        cell: "text-foreground/90",
        footer: "bg-info/5",
      }}
      className="max-w-2xl"
    >
      <Table.ScrollContainer>
        <Table.Content aria-label="Команда">
          <Table.Header>
            <Table.Column isRowHeader>Имя</Table.Column>
            <Table.Column>Роль</Table.Column>
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
        <span className="text-small text-muted">Все слоты настроены через classNames.</span>
      </Table.Footer>
    </Table>
  ),
};
