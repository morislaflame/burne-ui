import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from ".";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[18rem] w-full flex-col items-start justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
];

const meta = {
  title: "Core Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Компонент-заглушка для состояния загрузки. **Три анимации**: `pulse` (мигание), `wave` (скользящая полоса), `shimmer` (градиент), `none` (без анимации). Состав: `<Skeleton>` — произвольный блок, `<Skeleton.Circle>` — круг, `<Skeleton.Text>` — строки текста, `<Skeleton.Block>` — карточка.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Variants ─────────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: "Все варианты анимации",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      {(["wave", "pulse", "shimmer", "none"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-small">
          <p className="text-small font-medium text-muted capitalize">{variant}</p>
          <Skeleton variant={variant} className="h-4 w-full" />
          <Skeleton variant={variant} className="h-4 w-4/5" />
          <Skeleton variant={variant} className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  ),
};

// ─── Text skeleton ────────────────────────────────────────────────────────────

export const TextLines: Story = {
  name: "Текстовые строки",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      {(["wave", "pulse", "shimmer"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-small">
          <p className="text-small text-muted">{variant}</p>
          <Skeleton.Text variant={variant} lines={3} />
        </div>
      ))}
    </div>
  ),
};

// ─── Circle skeleton ──────────────────────────────────────────────────────────

export const Circles: Story = {
  name: "Круглые",
  render: () => (
    <div className="flex flex-wrap gap-mid">
      {(["wave", "pulse", "shimmer"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-small">
          <p className="text-small text-muted">{variant}</p>
          <Skeleton.Circle variant={variant} size="h-12 w-12" />
        </div>
      ))}
    </div>
  ),
};

// ─── Card layout ─────────────────────────────────────────────────────────────

export const CardLayout: Story = {
  name: "Карточка (все варианты)",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      {(["wave", "pulse", "shimmer"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-small">
          <p className="text-small text-muted">{variant}</p>
          <div className="flex flex-col gap-plus rounded-mid border border-base p-plus">
            {/* avatar + name row */}
            <div className="flex items-center gap-plus">
              <Skeleton.Circle variant={variant} size="h-10 w-10" />
              <div className="flex flex-1 flex-col gap-xsmall">
                <Skeleton variant={variant} className="h-3 w-32 rounded-full" />
                <Skeleton variant={variant} className="h-3 w-20 rounded-full" />
              </div>
            </div>
            {/* cover image */}
            <Skeleton variant={variant} className="h-40 w-full rounded-small" />
            {/* text lines */}
            <Skeleton.Text variant={variant} lines={2} />
            {/* action row */}
            <div className="flex gap-small">
              <Skeleton variant={variant} className="h-control-base w-20 rounded-small" />
              <Skeleton variant={variant} className="h-control-base w-20 rounded-small" />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};

// ─── List layout ─────────────────────────────────────────────────────────────

export const ListLayout: Story = {
  name: "Список",
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-xsmall">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-plus py-small">
          <Skeleton.Circle variant="wave" size="h-9 w-9" />
          <div className="flex flex-1 flex-col gap-xsmall">
            <Skeleton
              variant="wave"
              className="h-3 rounded-full"
              style={{ width: `${60 + (i % 3) * 15}%`, animationDelay: `${i * 0.08}s` }}
            />
            <Skeleton
              variant="wave"
              className="h-3 rounded-full w-2/5"
              style={{ animationDelay: `${i * 0.08 + 0.04}s` }}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

// ─── Block ────────────────────────────────────────────────────────────────────

export const BlockSkeleton: Story = {
  name: "Skeleton.Block",
  render: () => (
    <div className="flex gap-mid">
      {(["wave", "pulse", "shimmer"] as const).map((v) => (
        <Skeleton.Block key={v} variant={v} className="h-32 w-40" />
      ))}
    </div>
  ),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const CustomSizes: Story = {
  name: "Разные размеры",
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-small">
      <Skeleton variant="wave" className="h-2 w-full rounded-full" />
      <Skeleton variant="wave" className="h-3 w-full rounded-full" />
      <Skeleton variant="wave" className="h-4 w-full rounded-full" />
      <Skeleton variant="wave" className="h-6 w-full rounded-small" />
      <Skeleton variant="wave" className="h-8 w-full rounded-small" />
      <Skeleton variant="wave" className="h-12 w-full rounded-mid" />
      <Skeleton variant="wave" className="h-24 w-full rounded-mid" />
    </div>
  ),
};
