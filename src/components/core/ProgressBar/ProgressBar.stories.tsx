import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/components/core/utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/components/core/utils/dualApiStorySource";

import { ProgressBar } from ".";

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
  title: "Core Components/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Полоса прогресса (read-only). **Simple** — props на root; **Compound** — `<ProgressBar.Header>` + `<ProgressBar.Track>` + `<ProgressBar.Hint>`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple и Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props на &lt;ProgressBar&gt;">
        <ProgressBar
          label="Загрузка"
          hint="Оценка времени завершения"
          showValue
          value={65}
          min={0}
          max={100}
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <ProgressBar>
          <ProgressBar.Header>
            <ProgressBar.Label>Загрузка файла</ProgressBar.Label>
            <ProgressBar.Value />
          </ProgressBar.Header>
          <ProgressBar.Track value={42} min={0} max={100} />
          <ProgressBar.Hint>Оценка времени завершения</ProgressBar.Hint>
        </ProgressBar>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const Indeterminate: Story = {
  name: "Indeterminate",
  render: () => (
    <ProgressBar label="Обработка" indeterminate showValue={false} />
  ),
};

export const Colors: Story = {
  name: "Цвета",
  render: () => (
    <div className="flex flex-col gap-mid">
      <ProgressBar label="Accent (по умолчанию)" showValue value={65} />
      <ProgressBar label="Success" showValue value={80} color="var(--color-success)" />
      <ProgressBar label="Danger" showValue value={35} color="var(--color-danger)" />
      <ProgressBar label="Warning" showValue value={55} color="var(--color-warning)" />
      <ProgressBar label="Hex" showValue value={70} color="#7c3aed" />
      <ProgressBar
        label="Градиент"
        showValue
        value={60}
        color="linear-gradient(90deg, var(--color-primary) 0%, var(--color-info) 100%)"
      />
    </div>
  ),
};

export const Thickness: Story = {
  name: "Толщина",
  render: () => (
    <div className="flex flex-col gap-mid">
      <ProgressBar label="6px" showValue thickness={6} value={40} />
      <ProgressBar label="1rem" showValue thickness="1rem" value={60} />
      <ProgressBar label="size=small + thickness=16" showValue size="small" thickness={16} value={75} />
    </div>
  ),
};

export const CustomValueText: Story = {
  name: "Свой текст значения",
  render: () => (
    <div className="flex flex-col gap-mid">
      <ProgressBar label="Батарея" valueText="Заряжается" value={72} />
      <ProgressBar label="Сеть" valueText="Отличное соединение" value={92} color="var(--color-success)" />
      <ProgressBar
        label="Диск"
        valueText="Высокая нагрузка"
        value={88}
        color="var(--color-warning)"
      />
    </div>
  ),
};

export const Vertical: Story = {
  name: "Вертикальная",
  render: () => (
    <div className="flex gap-xlarge">
      <ProgressBar orientation="vertical" label="CPU" showValue value={45} />
      <ProgressBar orientation="vertical" label="RAM" showValue value={72} color="var(--color-info)" />
      <ProgressBar orientation="vertical" label="Disk" valueText="Высокая" value={88} color="var(--color-warning)" />
    </div>
  ),
};

export const Animated: Story = {
  name: "Анимация",
  render: function Animated() {
    const [value, setValue] = useState(0);

    useEffect(() => {
      const id = window.setInterval(() => {
        setValue((v) => (v >= 100 ? 0 : v + 5));
      }, 400);
      return () => window.clearInterval(id);
    }, []);

    return (
      <ProgressBar label="Скачивание" min={0} max={100} value={value} showValue color="var(--color-primary)" />
    );
  },
};

export const OnLightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
  render: () => <ProgressBar label="Прогресс" showValue value={55} />,
};

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex flex-col gap-plus text-left">
      <p className="text-sm text-muted">
        Шкала — <code className="text-primary">role=&quot;progressbar&quot;</code> с{" "}
        <code className="text-primary">aria-valuenow</code> /{" "}
        <code className="text-primary">aria-valuemin</code> /{" "}
        <code className="text-primary">aria-valuemax</code> (или{" "}
        <code className="text-primary">aria-busy</code> при indeterminate). Подпись —{" "}
        <code className="text-primary">aria-labelledby</code>, hint —{" "}
        <code className="text-primary">aria-describedby</code>.
      </p>
      <ProgressBar
        label="Скачивание"
        hint="Оставшееся время зависит от скорости сети"
        showValue
        value={48}
        min={0}
        max={100}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("progressbar", { name: /Скачивание/ })).toHaveAttribute(
      "aria-valuenow",
      "48",
    );
  },
};
