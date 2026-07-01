import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoStar } from "react-icons/io5";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/components/core/utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/components/core/utils/dualApiStorySource";
import { Label } from "@/components/core/Label";

import { Checkbox } from "./index";

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
  title: "Core Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Чекбокс. **Simple** — `label`, `hint` на root; **Compound** — `<Checkbox.Control>` / `<Checkbox.Indicator>` / `<Checkbox.Content>` с `<Checkbox.Label>` или `<Label htmlFor>`.",
      },
    },
  },
  decorators: [...framedDecorator],
  args: {
    label: "Согласие на обработку данных",
    size: "base" as const,
    variant: "default" as const,
    disabled: false,
    danger: false,
  },
  argTypes: {
    size: { control: "select", options: ["small", "base", "mid", "large"] },
    variant: { control: "select", options: ["default", "secondary", "outline"] },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple и Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props на &lt;Checkbox&gt;">
        <Checkbox
          defaultChecked
          label="Email-уведомления"
          hint="Краткое описание опции"
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — Checkbox.Label">
        <Checkbox defaultChecked id="compound-notifications">
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Checkbox.Label>Email-уведомления</Checkbox.Label>
            <Checkbox.Hint>Краткое описание опции</Checkbox.Hint>
          </Checkbox.Content>
        </Checkbox>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const WithLabelHtmlFor: Story = {
  name: "Compound — Label htmlFor",
  render: () => (
    <Checkbox defaultChecked id="default-notifications">
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Content>
        <Label htmlFor="default-notifications">Enable email notifications</Label>
      </Checkbox.Content>
    </Checkbox>
  ),
};

export const Playground: Story = {};

export const ToggleInteraction: Story = {
  name: "Interaction: переключение",
  args: { label: "Согласие на обработку данных" },
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole("checkbox", {
      name: "Согласие на обработку данных",
    });
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <Checkbox
          key={size}
          size={size}
          defaultChecked={size === "base"}
          label={`Размер ${size}`}
          hint="Подзаголовок в muted"
        />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  name: "Варианты кружка",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid">
      <Checkbox variant="default" defaultChecked label="default" />
      <Checkbox variant="secondary" label="secondary" />
      <Checkbox variant="outline" defaultChecked label="outline (o)" />
    </div>
  ),
};

export const States: Story = {
  name: "Состояния",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid">
      <Checkbox label="Обычное" hint="Без danger" />
      <Checkbox danger label="С ошибкой" hint="Подзаголовок остаётся muted" />
      <Checkbox disabled label="Отключено" hint="Нельзя переключить" />
      <Checkbox disabled defaultChecked label="Отключено, включено" />
    </div>
  ),
};

export const CustomIcon: Story = {
  name: "Своя иконка",
  render: () => (
    <Checkbox defaultChecked checkIcon={<IoStar aria-hidden className="size-full" />} label="Избранное" hint="Вместо галочки — звезда" />
  ),
};

export const CustomIndicator: Story = {
  name: "Compound — свой Indicator",
  render: () => (
    <Checkbox defaultChecked>
      <Checkbox.Control>
        <Checkbox.Indicator>
          <IoStar aria-hidden className="text-primary-foreground" />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Content>
        <Checkbox.Label>Избранное</Checkbox.Label>
        <Checkbox.Hint>Своя иконка с той же анимацией заливки, что у галочки</Checkbox.Hint>
      </Checkbox.Content>
    </Checkbox>
  ),
};

export const IndicatorShape: Story = {
  name: "Indicator — форма",
  render: () => (
    <Checkbox defaultChecked size="large">
      <Checkbox.Control>
        <Checkbox.Indicator
          classNames={{
            shell: "rounded-mid",
            fill: "rounded-[inherit]",
          }}
        />
      </Checkbox.Control>
      <Checkbox.Content>
        <Checkbox.Label>rounded-mid</Checkbox.Label>
        <Checkbox.Hint>classNames.shell + fill с rounded-[inherit].</Checkbox.Hint>
      </Checkbox.Content>
    </Checkbox>
  ),
};

export const IndicatorCompound: Story = {
  name: "Indicator — Fill + Mark",
  render: () => (
    <Checkbox defaultChecked variant="outline">
      <Checkbox.Control>
        <Checkbox.Indicator classNames={{ shell: "rounded-mid" }}>
          <Checkbox.Indicator.Fill className="rounded-[inherit]" />
          <Checkbox.Indicator.Mark>
            <IoStar aria-hidden className="text-primary" />
          </Checkbox.Indicator.Mark>
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Content>
        <Checkbox.Label>Compound слоты</Checkbox.Label>
        <Checkbox.Hint>Checkbox.Indicator.Fill и Checkbox.Indicator.Mark.</Checkbox.Hint>
      </Checkbox.Content>
    </Checkbox>
  ),
};

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Simple: native <code className="text-primary">&lt;label&gt;</code> + скрытый input. Compound:{" "}
        <code className="text-primary">role=&quot;group&quot;</code>,{" "}
        <code className="text-primary">aria-labelledby</code>, hint и error —{" "}
        <code className="text-primary">aria-describedby</code>.
      </p>
      <Checkbox
        id="a11y-checkbox"
        defaultChecked
        label="Согласие"
        hint="Подсказка связана через aria-describedby"
      />
      <Checkbox
        id="a11y-checkbox-error"
        label="Согласие на обработку"
        hint="Обязательно для регистрации"
        error="Примите условия, чтобы продолжить."
      />
    </div>
  ),
};

function ControlledDemo() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex max-w-md flex-col gap-plus">
      <Checkbox
        checked={on}
        onChange={(e) => setOn(e.target.checked)}
        label="Управляемый чекбокс"
        hint={`Сейчас: ${on ? "вкл" : "выкл"}`}
      />
    </div>
  );
}

export const Controlled: Story = {
  name: "Контролируемый",
  render: () => <ControlledDemo />,
};

export const OnLightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex max-w-md flex-col gap-mid">
      <Checkbox defaultChecked label="Светлая тема" hint="primary / primary-foreground" />
      <Checkbox variant="outline" label="Outline" />
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Полная кастомизация classNames",
  parameters: {
    docs: {
      description: {
        story: "кастомизация classNames для Checkbox (compound API)",
      },
    },
  },
  render: () => (
    <Checkbox
      defaultChecked
      variant="outline"
      classNames={{
        root: "rounded-large border-primary/40 bg-primary/5 p-mid shadow-token-md",
        control: "ring-primary/30",
        controlTrack: "border-primary/50",
        indicator: "rounded-mid",
        indicatorFill: "rounded-[inherit]",
        labelText: "text-primary font-semibold",
        hint: "text-foreground/80",
      }}
    >
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Content>
        <Checkbox.Label>Согласие на рассылку</Checkbox.Label>
        <Checkbox.Hint>Все слоты настроены через classNames.</Checkbox.Hint>
      </Checkbox.Content>
    </Checkbox>
  ),
};
