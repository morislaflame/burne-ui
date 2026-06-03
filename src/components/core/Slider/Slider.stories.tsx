import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoVolumeHigh } from "react-icons/io5";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
  dualApiStorySource,
} from "@/components/core/utils/dualApiStoryChrome";

import { Slider } from ".";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[18rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
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
      className="box-border flex min-h-[18rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Слайдер с кружком в стиле `Checkbox`. **Simple** — props на root; **Compound** — `<Slider.Header>` + `<Slider.Track>` + `<Slider.Hint>`. **a11y:** `role=\"slider\"` на thumb, подпись — `aria-labelledby`, hint — `aria-describedby`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    size: { control: "select", options: ["small", "base", "mid", "large"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple и Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props на &lt;Slider&gt;">
        <Slider
          label="Громкость"
          hint="Подсказка под шкалой"
          showValue
          defaultValue={40}
          min={0}
          max={100}
          step={1}
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Slider>
          <Slider.Header>
            <Slider.Label>Громкость</Slider.Label>
            <Slider.Value />
          </Slider.Header>
          <Slider.Track defaultValue={55} min={0} max={100} step={1} />
          <Slider.Hint>Подсказка под шкалой</Slider.Hint>
        </Slider>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <Slider
          key={size}
          size={size}
          label={`Размер ${size}`}
          showValue
          defaultValue={30 + (size === "large" ? 40 : size === "mid" ? 25 : 15)}
        />
      ))}
    </div>
  ),
};

export const Range: Story = {
  name: "Диапазон",
  render: () => (
    <Slider
      range={true}
      label="Цена"
      showValue
      min={0}
      max={1000}
      step={10}
      defaultValue={[200, 750]}
      formatValue={(v) => `${v} ₽`}
    />
  ),
};

export const WithMarks: Story = {
  name: "Деления",
  render: () => (
    <Slider
      label="Уровень"
      showValue
      min={0}
      max={100}
      marks={[0, 25, 50, 75, 100]}
      defaultValue={50}
    />
  ),
};

export const WithIcon: Story = {
  name: "С иконкой",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      <Slider
        label="Громкость"
        showValue
        defaultValue={45}
        icon={<IoVolumeHigh aria-hidden className="size-full" />}
      />
      <Slider
        range={true}
        label="Диапазон"
        showValue
        defaultValue={[25, 70]}
        icon={<IoVolumeHigh aria-hidden className="size-full" />}
      />
    </div>
  ),
};

export const CompoundTrack: Story = {
  name: "Compound Track",
  render: () => (
    <Slider>
      <Slider.Header>
        <Slider.Label>Громкость</Slider.Label>
        <Slider.Value />
      </Slider.Header>
      <Slider.Track defaultValue={55} min={0} max={100} step={1}>
        <Slider.Rail>
          <Slider.Fill />
        </Slider.Rail>
        <Slider.Thumb>
          <Slider.Icon>
            <IoVolumeHigh aria-hidden className="size-full" />
          </Slider.Icon>
        </Slider.Thumb>
      </Slider.Track>
      <Slider.Hint>Slider.Rail + Fill + Thumb + Icon</Slider.Hint>
    </Slider>
  ),
};

export const CustomThickness: Story = {
  name: "Своя толщина",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      <Slider label="10px" showValue thickness={10} defaultValue={35} />
      <Slider label="1.25rem" showValue thickness="1.25rem" defaultValue={55} />
      <Slider label="size=small + thickness=20" showValue size="small" thickness={20} defaultValue={70} />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Отключён",
  render: () => (
    <Slider disabled defaultValue={60} label="Недоступно" showValue />
  ),
};

export const Vertical: Story = {
  name: "Вертикальный",
  render: () => (
    <div className="flex h-64 items-center gap-xlarge">
      <Slider orientation="vertical" label="Яркость" showValue defaultValue={65} />
      <Slider orientation="vertical" range={true} label="Диапазон" showValue defaultValue={[20, 80]} />
    </div>
  ),
};

export const WithoutLabel: Story = {
  name: "Без подписи",
  render: () => <Slider showValue={false} defaultValue={25} />,
};

export const Controlled: Story = {
  name: "Контролируемый",
  render: function Controlled() {
    const [value, setValue] = useState(35);
    return (
      <Slider label="Контролируемый" showValue value={value} onValueChange={setValue} />
    );
  },
};

export const OnLightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
  render: () => <Slider label="Светлая тема" showValue defaultValue={55} />,
};

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex flex-col gap-plus text-left">
      <p className="text-sm text-muted">
        Ползунок — <code className="text-accent">role=&quot;slider&quot;</code> на{" "}
        <code className="text-accent">&lt;button&gt;</code> с{" "}
        <code className="text-accent">aria-valuenow</code> / min / max. Подпись —{" "}
        <code className="text-accent">aria-labelledby</code> от <code className="text-accent">Slider.Label</code>
        , hint — <code className="text-accent">aria-describedby</code>. Без label — fallback{" "}
        <code className="text-accent">aria-label=&quot;Значение&quot;</code>.
      </p>
      <Slider label="Громкость" hint="Подсказка связана через aria-describedby" showValue defaultValue={48} />
    </div>
  ),
};
