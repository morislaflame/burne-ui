import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Pagination } from "./Pagination";

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
          "Пагинация в стиле `Breadcrumbs`: muted-кнопки с hover-lift и squeeze. Составной API — summary, prev/next, номера страниц.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

function SimplePrevNextDemo() {
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
}

export const SimplePrevNext: Story = {
  name: "Назад / Вперёд",
  render: () => <SimplePrevNextDemo />,
};

function FullPagesDemo() {
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
}

export const FullPages: Story = {
  name: "Номера страниц",
  render: () => <FullPagesDemo />,
};

function WithSummaryDemo() {
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
}

export const WithSummary: Story = {
  name: "Summary + страницы",
  render: () => <WithSummaryDemo />,
};

function CustomLabelsDemo() {
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
}

export const CustomLabels: Story = {
  name: "Свои подписи",
  render: () => <CustomLabelsDemo />,
};

export const LightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
  render: () => <WithSummaryDemo />,
};
