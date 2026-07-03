import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";

import { Pagination } from "@/components/core/Pagination";

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
          "Pagination in the `Breadcrumbs` style: muted buttons with hover-lift and squeeze. Compound API — `Summary`, `Content`, `Item`, `Previous` / `Next`, `Pages`.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SimplePrevNext: Story = {
  name: "Previous / Next",
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
          {startItem}–{endItem} of {totalItems} invoices
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
  name: "Page numbers",
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
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Forward" }));
    await waitFor(() => {
      const current = canvasElement.querySelector("[aria-current='page']");
      expect(current).toHaveTextContent("6");
    });
  },
};

export const WithSummary: Story = {
  name: "Summary + pages",
  render: function WithSummary() {
    const [page, setPage] = useState(3);
    const totalPages = 12;

    return (
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage}>
        <Pagination.Summary>
          Page {page} of {totalPages}
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
  name: "Custom labels",
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
  name: "Accessibility",
  render: function Accessibility() {
    const [page, setPage] = useState(4);
    const totalPages = 10;

    return (
      <div className="flex flex-col gap-mid text-left">
        <p className="text-sm text-muted">
          Root — <code className="text-primary">&lt;nav aria-label&gt;</code>. List —{" "}
          <code className="text-primary">&lt;ol&gt;</code> /{" "}
          <code className="text-primary">&lt;li&gt;</code>. Current page —{" "}
          <code className="text-primary">aria-current=&quot;page&quot;</code> (not a button). For
          prev/next with visible text, the name comes from the label (WCAG Label in Name); for icon-only —
          pass <code className="text-primary">aria-label</code>. Ellipsis —{" "}
          <code className="text-primary">aria-hidden</code>.
        </p>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage}>
          <Pagination.Summary>
            Page {page} of {totalPages}
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
  name: "Light theme",
  decorators: [...lightThemeDecorator],
  render: function LightTheme() {
    const [page, setPage] = useState(3);
    const totalPages = 12;

    return (
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage}>
        <Pagination.Summary>
          Page {page} of {totalPages}
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

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story:
          "Slots root, summary, content, interactive, pageActive, and navText via the classNames prop.",
      },
    },
  },
  render: function CustomClassNamesStory() {
    const [page, setPage] = useState(3);
    const totalPages = 12;

    return (
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        classNames={{
          root: "rounded-mid border border-primary/20 p-base",
          summaryText: "text-primary",
          content: "gap-small",
          interactive: "text-info hover:text-primary",
          pageActive: "text-primary font-semibold",
          navText: "font-medium",
        }}
      >
        <Pagination.Summary>
          Page {page} of {totalPages}
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
