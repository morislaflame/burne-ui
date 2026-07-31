import type { ComponentType, MouseEvent } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen } from "storybook/test";

import { DualApiStoryPanel, DualApiStoryPanels } from "@/stories-utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/stories-utils/dualApiStorySource";

import { Breadcrumbs } from ".";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
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
      className="box-border flex h-full min-h-[14rem] w-full flex-col items-center justify-center p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const preventNav = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
  e.preventDefault();
};

const meta = {
  title: "Core Components/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Navigation breadcrumb trail. **Simple** — `items` on root; **Compound** — `Breadcrumbs.List` + `Breadcrumbs.Item`. With `collapse`, the «…» button opens a `Dropdown` with hidden sections.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple and Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — items on &lt;Breadcrumbs&gt;">
        <Breadcrumbs
          items={[
            { label: "Home", href: "#", onClick: preventNav },
            { label: "Catalog", href: "#", onClick: preventNav },
            { label: "Current page", current: true },
          ]}
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Breadcrumbs>
          <Breadcrumbs.List>
            <Breadcrumbs.Item href="#" onClick={preventNav}>
              Home
            </Breadcrumbs.Item>
            <Breadcrumbs.Item href="#" onClick={preventNav}>
              Catalog
            </Breadcrumbs.Item>
            <Breadcrumbs.Item current>Current page</Breadcrumbs.Item>
          </Breadcrumbs.List>
        </Breadcrumbs>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const Collapsed: Story = {
  name: "Collapse + «…» menu",
  render: () => (
    <div className="flex flex-col items-center gap-large">
      <p className="max-w-md text-center text-sm text-muted">
        With more than three items: first · … · last two. Click «…» — list of hidden
        sections.
      </p>
      <Breadcrumbs>
        <Breadcrumbs.List>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Home
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Section
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Subsection
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Category
          </Breadcrumbs.Item>
          <Breadcrumbs.Item current>Page</Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /hidden sections/ }));
    await expect(screen.getByRole("menu")).toBeVisible();
  },
};

export const Expanded: Story = {
  name: "No collapse",
  render: () => (
    <Breadcrumbs collapse={false}>
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Section
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Subsection
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Category
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Page</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  ),
};

export const TwoItems: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Catalog
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Product</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  ),
};

export const SingleCurrent: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.List>
        <Breadcrumbs.Item current>Current only</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  ),
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div className="flex max-w-lg flex-col gap-large text-left">
      <p className="text-sm text-muted">
        <code className="text-primary">&lt;nav aria-label&gt;</code>, current page —{" "}
        <code className="text-primary">aria-current=&quot;page&quot;</code> on the last item,
        «…» menu — <code className="text-primary">aria-expanded</code> /{" "}
        <code className="text-primary">role=&quot;menu&quot;</code>, Escape closes.
      </p>
      <Breadcrumbs aria-label="Path to page">
        <Breadcrumbs.List>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Home
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Catalog
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Electronics
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Laptops
          </Breadcrumbs.Item>
          <Breadcrumbs.Item current>MacBook Pro</Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs>
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story:
          "classNames customization for Breadcrumbs",
      },
    },
  },
  render: () => (
    <Breadcrumbs
      className="rounded-mid border border-token p-small"
      classNames={{
        list: "gap-small",
        item: "gap-small",
        separator: "text-primary opacity-100",
        separatorWrapper: "text-primary",
        itemLink: "text-info hover:text-info",
        itemLinkWrapper: "rounded-small",
        itemLinkText: "tracking-tight",
        itemStatic: "text-warning",
        itemActive: "font-semibold text-success",
        ellipsisLiftWrapper: "rounded-small",
        ellipsisText: "font-semibold",
        ellipsisPopover: "border border-token",
        dropdownItem: "text-foreground",
      }}
    >
      <Breadcrumbs.List
        classNames={{
          ellipsisTrigger: "text-warning",
        }}
      >
        <Breadcrumbs.Item href="#" onClick={preventNav} className="underline">
          Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Catalog
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Subsection
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Category
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current className="tracking-wide">
          Current
        </Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  ),
};

export const LightTheme: Story = {
  decorators: [...lightThemeDecorator],
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Section
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Subsection
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Category
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Page</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  ),
};

export const CompoundWrappedItems: Story = {
  name: "Compound — wrappers between Item",
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.List>
        <div>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Home
          </Breadcrumbs.Item>
        </div>
        <div className="contents">
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Catalog
          </Breadcrumbs.Item>
          <Breadcrumbs.Item current>Page</Breadcrumbs.Item>
        </div>
      </Breadcrumbs.List>
    </Breadcrumbs>
  ),
};
