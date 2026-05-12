import type { ComponentType, MouseEvent } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Breadcrumbs, type BreadcrumbItem } from "./Breadcrumbs";

const framedDecorator = [
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
      className="box-border flex flex-col items-center justify-center w-full h-full min-h-[14rem] p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const preventNav = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
  e.preventDefault();
};

const shortChain: BreadcrumbItem[] = [
  { label: "Главная", href: "#", onClick: preventNav },
  { label: "Каталог", href: "#", onClick: preventNav },
  { label: "Текущая страница" },
];

const longChain: BreadcrumbItem[] = [
  { label: "Главная", href: "#", onClick: preventNav },
  { label: "Раздел", href: "#", onClick: preventNav },
  { label: "Подраздел", href: "#", onClick: preventNav },
  { label: "Категория", href: "#", onClick: preventNav },
  { label: "Страница" },
];

const meta = {
  title: "Core Components/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: shortChain,
  },
};

export const Collapsed: Story = {
  args: {
    items: longChain,
  },
};

export const TwoItems: Story = {
  args: {
    items: [
      { label: "Каталог", href: "#", onClick: preventNav },
      { label: "Товар" },
    ],
  },
};

export const SingleCurrent: Story = {
  args: {
    items: [{ label: "Только текущая" }],
  },
};

export const LightTheme: Story = {
  decorators: [...lightThemeDecorator],
  args: {
    items: longChain,
  },
};
