import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Ripple } from "@/components/core/Ripple";

import { Accordion } from "./Accordion";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-2xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const infoIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const meta = {
  title: "Composite Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

const DEMO_ITEMS = [
  {
    id: "delivery",
    title: "Как оформить заказ?",
    icon: infoIcon,
    content: (
      <p className="text-sm text-muted">
        Доставка по РФ 2-5 дней. Международная доставка рассчитывается отдельно.
      </p>
    ),
  },
  {
    id: "returns",
    title: "При каких условиях можно вернуть товар?",
    content: (
      <p className="text-sm text-muted">
        Возврат возможен в течение 14 дней при сохранении товарного вида.
      </p>
    ),
  },
  {
    id: "care",
    title: "Как ухаживать за товаром?",
    content: (
      <p className="text-sm text-muted">
        Избегайте абразивов и агрессивной химии. Хранить в сухом месте.
      </p>
    ),
  },
] as const;

export const Default: Story = {
  args: {
    items: DEMO_ITEMS,
    defaultOpenId: "delivery",
  },
};

export const PressRipple: Story = {
  name: "Риппл по нажатию в триггере",
  args: {
    items: DEMO_ITEMS,
    defaultOpenId: "delivery",
  },
  render: ({ items: _items, ...args }) => (
    <Accordion
      {...args}
      items={DEMO_ITEMS.map((item) => ({
        ...item,
        triggerBefore: <Ripple color="accentMuted" />,
      }))}
    />
  ),
};
