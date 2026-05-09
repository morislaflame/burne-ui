import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Accordion } from "./Accordion";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border w-full p-8 text-b-text"
      style={{ backgroundColor: "var(--b-color-bg)" }}
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
    title: "Доставка",
    icon: infoIcon,
    content: (
      <p className="text-sm text-b-muted">
        Доставка по РФ 2-5 дней. Международная доставка рассчитывается отдельно.
      </p>
    ),
  },
  {
    id: "returns",
    title: "Возврат",
    content: (
      <p className="text-sm text-b-muted">
        Возврат возможен в течение 14 дней при сохранении товарного вида.
      </p>
    ),
  },
  {
    id: "care",
    title: "Уход",
    content: (
      <p className="text-sm text-b-muted">
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

export const HoverAnimated: Story = {
  name: "Hover-анимации в items",
  args: {
    items: DEMO_ITEMS,
    hoverAnimated: true,
  },
};

export const PressRipple: Story = {
  name: "Риппл по нажатию в items",
  args: {
    items: DEMO_ITEMS,
    pressRipple: true,
  },
};
