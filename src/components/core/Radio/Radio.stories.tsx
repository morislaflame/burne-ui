import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoStar } from "react-icons/io5";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/components/core/utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/components/core/utils/dualApiStorySource";

import { Radio } from ".";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Радиокнопка. **Simple** — `label`, `hint` и props input на root; **Compound** — `<Radio.Control>` / `<Radio.Indicator>` / `<Radio.Content>` с `<Radio.Label>` и `<Radio.Hint>`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  args: {
    label: "Вариант A",
    name: "demo",
    value: "a",
  },
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple и Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props на &lt;Radio&gt;">
        <Radio name="simple" value="a" label="Вариант A" hint="Краткое описание варианта" defaultChecked />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Radio name="compound" value="b">
          <Radio.Control />
          <Radio.Content>
            <Radio.Label>Вариант B</Radio.Label>
            <Radio.Hint>Краткое описание варианта</Radio.Hint>
          </Radio.Content>
        </Radio>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const Playground: Story = {};

export const WithHint: Story = {
  name: "С подсказкой",
  args: {
    label: "Курьер",
    hint: "Доставка 1–2 дня",
    defaultChecked: true,
  },
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex flex-col gap-mid">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <Radio
          key={size}
          size={size}
          name="sizes"
          value={size}
          label={`Размер ${size}`}
          defaultChecked={size === "base"}
        />
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  name: "Отключён",
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const CustomIndicator: Story = {
  name: "Свой индикатор",
  render: () => (
    <div className="flex flex-col gap-mid">
      <Radio name="custom-indicator" value="plain">
        <Radio.Control />
        <Radio.Content>
          <Radio.Label>Стандартный</Radio.Label>
          <Radio.Hint>Круг с анимированной заливкой</Radio.Hint>
        </Radio.Content>
      </Radio>
      <Radio name="custom-indicator" value="star" defaultChecked>
        <Radio.Control>
          <Radio.Indicator>
            <IoStar aria-hidden className="size-full text-primary-foreground" />
          </Radio.Indicator>
        </Radio.Control>
        <Radio.Content>
          <Radio.Label>Избранный</Radio.Label>
          <Radio.Hint>Своя иконка с той же анимацией заливки, что у дефолтного индикатора</Radio.Hint>
        </Radio.Content>
      </Radio>
    </div>
  ),
};

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Simple и compound — native <code className="text-primary">&lt;label&gt;</code> вокруг input и
        текста. Hint и error — через{" "}
        <code className="text-primary">aria-describedby</code> (оба id, если заданы).
      </p>
      <Radio
        id="a11y-radio-simple"
        name="a11y-radio"
        value="simple"
        defaultChecked
        label="Курьер"
        hint="Доставка 1–2 рабочих дня"
      />
      <Radio id="a11y-radio-compound" name="a11y-radio" value="compound">
        <Radio.Control />
        <Radio.Content>
          <Radio.Label>Самовывоз</Radio.Label>
          <Radio.Hint>Бесплатно, сегодня</Radio.Hint>
        </Radio.Content>
      </Radio>
      <Radio
        id="a11y-radio-error"
        name="a11y-radio-error"
        value="invalid"
        label="Экспресс"
        hint="Доставка в день заказа"
        error="Недоступно для вашего региона."
      />
    </div>
  ),
};
