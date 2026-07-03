import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Card } from "@/components/core/Card";

import { SearchInput } from "./SearchInput";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
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
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Atomic expandable search. For forms — use `Input`. **a11y:** set `aria-label`; collapsed trigger — `role=\"button\"`, expanded field — `role=\"search\"` on the shell.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  args: {
    placeholder: "Search…",
    size: "base" as const,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["small", "base", "mid", "large"],
    },
    ripple: {
      control: "boolean",
      description: "Built-in `<Ripple color=\"neutral\" />` on the shell root.",
    },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRipple: Story = {
  name: "With ripple",
  args: {
    ripple: true,
  },
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-xlarge">
      <SearchInput size="small" placeholder="Search" />
      <SearchInput size="base" placeholder="Search" />
      <SearchInput size="mid" placeholder="Search" />
      <SearchInput size="large" placeholder="Search" />
    </div>
  ),
};

export const OnLight: Story = {
  name: "Light theme",
  decorators: [...lightThemeDecorator],
};

export const Controlled: Story = {
  name: "Controlled expanded",
  render: function Controlled() {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-mid">
        <SearchInput
          expanded={open}
          onExpandedChange={setOpen}
          placeholder="Controlled field"
          aria-label="Controlled search"
        />
        <button
          type="button"
          className="text-sm text-muted underline"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Collapse" : "Expand"} externally
        </button>
      </div>
    );
  },
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Collapsed — <code className="text-primary">role=&quot;button&quot;</code>,{" "}
        <code className="text-primary">aria-expanded</code>, Enter/Space opens. Expanded —{" "}
        <code className="text-primary">role=&quot;search&quot;</code>, focus on{" "}
        <code className="text-primary">input</code>. Set{" "}
        <code className="text-primary">aria-label</code> instead of a single placeholder. Clear —{" "}
        <code className="text-primary">aria-label=&quot;Clear field&quot;</code>.
      </p>
      <SearchInput aria-label="Search documentation" placeholder="Search…" />
    </div>
  ),
};

export const ExpandInteraction: Story = {
  name: "Interaction: input",
  render: () => (
    <SearchInput aria-label="Search documentation" placeholder="Search…" defaultExpanded />
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("searchbox");
    await userEvent.type(input, "component");
    await expect(input).toHaveValue("component");
  },
};

const DEMO_EVENTS = [
  {
    id: "1",
    title: "Library release",
    subtitle: "npm and Storybook publishing",
  },
  {
    id: "2",
    title: "Theme tokens",
    subtitle: "Light and dark CSS variable schemes",
  },
  {
    id: "3",
    title: "Dialogs and modals",
    subtitle: "Dialog and AlertDialog components",
  },
  {
    id: "4",
    title: "Forms",
    subtitle: "Input, buttons, and validation",
  },
  {
    id: "5",
    title: "Search in the UI",
    subtitle: "SearchInput and list filtering",
  },
  {
    id: "6",
    title: "Animations",
    subtitle: "GSAP and hover-lift on cards",
  },
  {
    id: "7",
    title: "Accordion",
    subtitle: "Compound expandable list",
  },
];

function matchesQuery(
  q: string,
  title: string,
  subtitle: string,
): boolean {
  const n = q.trim().toLowerCase();
  if (!n) return true;
  return (
    title.toLowerCase().includes(n) || subtitle.toLowerCase().includes(n)
  );
}

export const FilterList: Story = {
  name: "Search card list",
  render: function FilterDemo() {
    const [query, setQuery] = useState("");

    const filtered = useMemo(
      () =>
        DEMO_EVENTS.filter((item) =>
          matchesQuery(query, item.title, item.subtitle),
        ),
      [query],
    );

    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-mid">
        <div className="flex w-full justify-end">
          <SearchInput
            placeholder="Title or description…"
            expandedWidth={400}
            collapseOnBlur={false}
            value={query}
            onValueChange={setQuery}
            aria-label="Card list filter"
          />
        </div>
        <p className="text-center text-xs text-muted">
          Found: {filtered.length} of {DEMO_EVENTS.length}
        </p>
        <ul className="flex list-none flex-col gap-plus p-0">
          {filtered.length === 0 ? (
            <li className="rounded-mid border-token border-dashed px-mid py-xlarge text-center text-sm text-muted">
              Nothing matched «{query.trim() || "…"}». Try another
              query.
            </li>
          ) : (
            filtered.map((item) => (
              <li key={item.id}>
                <Card>
                  <Card.Header>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Description>{item.subtitle}</Card.Description>
                  </Card.Header>
                </Card>
              </li>
            ))
          )}
        </ul>
      </div>
    );
  },
};
