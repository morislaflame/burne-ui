import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Pagination } from ".";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-lg">
        <Story />
      </div>
    </div>
  ),
] as const;

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-lg">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Пагинация в стиле `Breadcrumbs`: muted-кнопки с hover-lift и squeeze. Составной API — `Summary`, `Content`, `Item`, `Previous` / `Next`, `Pages`.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SimplePrevNext: Story = {
  name: "Назад / Вперёд",
  render: function SimplePrevNext() {
    const [page, setPage] = useState(1);
    const totalPages = 10;
    const itemsPerPage = 5;
    const totalItems = 50;

    const startItem = (page - 1) * itemsPerPage + 1;
    const endItem = Math.min(page * itemsPerPage, totalItems);

    return (
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage}>
        <Pagination.Summary>
          {startItem}–{endItem} из {totalItems} счетов
        </Pagination.Summary>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Next />
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    );
  },
};

export const FullPages: Story = {
  name: "Номера страниц",
  render: function FullPages() {
    const [page, setPage] = useState(5);
    const totalPages = 20;

    return (
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="justify-center"
      >
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
    );
  },
};

export const WithSummary: Story = {
  name: "Summary + страницы",
  render: function WithSummary() {
    const [page, setPage] = useState(3);
    const totalPages = 12;

    return (
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage}>
        <Pagination.Summary>
          Страница {page} из {totalPages}
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
    );
  },
};

export const CustomLabels: Story = {
  name: "Свои подписи",
  render: function CustomLabels() {
    const [page, setPage] = useState(2);
    const totalPages = 8;

    return (
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage}>
        <Pagination.Content className="mx-auto">
          <Pagination.Item>
            <Pagination.Previous>
              <Pagination.PreviousIcon />
              <span>Prev</span>
            </Pagination.Previous>
          </Pagination.Item>
          <Pagination.Pages />
          <Pagination.Item>
            <Pagination.Next>
              <span>Next</span>
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    );
  },
};

export const Accessibility: Story = {
  name: "Доступность",
  render: function Accessibility() {
    const [page, setPage] = useState(4);
    const totalPages = 10;

    return (
      <div className="flex flex-col gap-mid text-left">
        <p className="text-sm text-muted">
          Корень — <code className="text-primary">&lt;nav aria-label&gt;</code>. Список —{" "}
          <code className="text-primary">&lt;ol&gt;</code> /{" "}
          <code className="text-primary">&lt;li&gt;</code>. Текущая страница —{" "}
          <code className="text-primary">aria-current=&quot;page&quot;</code> (не кнопка). У
          prev/next с видимым текстом имя берётся из подписи (WCAG Label in Name); для icon-only —
          передайте <code className="text-primary">aria-label</code>. Ellipsis —{" "}
          <code className="text-primary">aria-hidden</code>.
        </p>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage}>
          <Pagination.Summary>
            Страница {page} из {totalPages}
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
      </div>
    );
  },
};

export const LightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
  render: function LightTheme() {
    const [page, setPage] = useState(3);
    const totalPages = 12;

    return (
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage}>
        <Pagination.Summary>
          Страница {page} из {totalPages}
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
    );
  },
};
