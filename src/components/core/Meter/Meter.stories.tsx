import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/components/core/utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/components/core/utils/dualApiStorySource";

import { Meter } from "@/components/core/Meter";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-md">
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
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Meter",
  component: Meter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Индикатор уровня (read-only). **Simple** — props на root; **Compound** — `<Meter.Header>` / `<Meter.Track>` / `<Meter.Hint>` / `<Meter.Error>`. **a11y:** `role=\"meter\"`, `aria-labelledby`, `aria-describedby` (hint + error), `aria-valuetext`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    size: { control: "select", options: ["small", "base", "mid", "large"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof Meter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple и Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props на &lt;Meter&gt;">
        <Meter label="Загрузка" hint="Read-only шкала" showValue value={42} min={0} max={100} />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Meter>
          <Meter.Header>
            <Meter.Label>Загрузка</Meter.Label>
            <Meter.Value />
          </Meter.Header>
          <Meter.Track value={58} min={0} max={100} />
          <Meter.Hint>Read-only шкала</Meter.Hint>
        </Meter>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <Meter
          key={size}
          size={size}
          label={`Размер ${size}`}
          showValue
          value={25 + (size === "large" ? 50 : size === "mid" ? 35 : size === "base" ? 20 : 10)}
        />
      ))}
    </div>
  ),
};

export const CustomColor: Story = {
  name: "Свой цвет",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-mid">
      <Meter label="Primary (по умолчанию)" showValue value={65} />
      <Meter label="Success" showValue value={80} color="var(--color-success)" />
      <Meter label="Danger" showValue value={35} color="var(--color-danger)" />
      <Meter label="Warning" showValue value={55} color="var(--color-warning)" />
      <Meter label="Hex" showValue value={70} color="#7c3aed" />
      <Meter
        label="Градиент"
        showValue
        value={85}
        color="linear-gradient(90deg, var(--color-primary) 0%, var(--color-info) 100%)"
      />
    </div>
  ),
};

export const CustomThickness: Story = {
  name: "Своя толщина",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      <Meter label="6px" showValue thickness={6} value={40} />
      <Meter label="1rem" showValue thickness="1rem" value={60} />
      <Meter label="size=small + thickness=16" showValue size="small" thickness={16} value={75} />
    </div>
  ),
};

export const StatusText: Story = {
  name: "Текст состояния",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-mid">
      <Meter label="Батарея" valueText="Заряжается" value={72} />
      <Meter label="Сеть" valueText="Отличное соединение" value={92} color="var(--color-success)" />
      <Meter
        label="Память"
        value={88}
        showValue
        formatValue={(v: number) => `${v}% занято`}
      />
    </div>
  ),
};

export const Vertical: Story = {
  name: "Вертикальный",
  render: () => (
    <div className="flex h-64 items-end gap-xlarge">
      <Meter orientation="vertical" label="CPU" showValue value={45} />
      <Meter orientation="vertical" label="RAM" showValue value={72} color="var(--color-info)" />
      <Meter orientation="vertical" label="Disk" valueText="Высокая" value={88} color="var(--color-warning)" />
    </div>
  ),
};

export const WithoutLabel: Story = {
  name: "Без подписи",
  render: () => <Meter showValue value={30} />,
};

export const Animated: Story = {
  name: "Анимация",
  render: function Animated() {
    const [value, setValue] = useState(20);

    useEffect(() => {
      const id = window.setInterval(() => {
        setValue((v) => (v >= 100 ? 15 : v + 7));
      }, 1200);
      return () => window.clearInterval(id);
    }, []);

    return (
      <Meter
        label="Анимация значения"
        showValue
        value={value}
        color="linear-gradient(90deg, var(--color-primary) 0%, var(--color-success) 100%)"
      />
    );
  },
};

export const OnLightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
  render: () => <Meter label="Светлая тема" showValue value={58} />,
};

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex flex-col gap-plus text-left">
      <p className="text-sm text-muted">
        Шкала — <code className="text-primary">role=&quot;meter&quot;</code> с{" "}
        <code className="text-primary">aria-valuenow</code> /{" "}
        <code className="text-primary">aria-valuemin</code> /{" "}
        <code className="text-primary">aria-valuemax</code>, подпись —{" "}
        <code className="text-primary">aria-labelledby</code>, hint и error —{" "}
        <code className="text-primary">aria-describedby</code>.
      </p>
      <Meter label="Загрузка CPU" hint="Read-only; значение обновляется автоматически" showValue value={67} />
      <Meter label="Квота API" hint="Лимит обновляется раз в сутки" showValue value={92} error="Превышен лимит запросов." />
    </div>
  ),
  play: async ({ canvas }) => {
    const meters = canvas.getAllByRole("meter");
    await expect(meters[0]).toHaveAttribute("aria-valuenow", "67");
  },
};

export const CustomClassNames: Story = {
  name: "Полная кастомизация classNames",
  parameters: {
    docs: {
      description: {
        story: "Слоты root, header, value, track, fill, hint и error через prop classNames.",
      },
    },
  },
  render: () => (
    <Meter
      label="Хранилище"
      hint="Read-only шкала"
      showValue
      value={72}
      color="var(--color-info)"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        header: "text-primary",
        value: "text-info font-semibold",
        track: "ring-1 ring-primary/15",
        fill: "opacity-90",
        hint: "text-muted/80",
      }}
    />
  ),
};
