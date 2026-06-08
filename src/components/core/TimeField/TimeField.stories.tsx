import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoTimeOutline } from "react-icons/io5";

import { Text } from "@/components/core/Text";
import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/components/core/utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/components/core/utils/dualApiStorySource";

import { TimeField } from "./index";

function isValidTime(value: string) {
  const parts = value.split(":").map(Number);
  if (parts.length < 2) return false;
  const [h, m, s = 0] = parts;
  return h >= 0 && h <= 23 && m >= 0 && m <= 59 && s >= 0 && s <= 59;
}

function ValidatedTimeCompoundDemo({ initialValue = "25:00" }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  const invalid = value.length > 0 && !isValidTime(value);

  return (
    <TimeField status={invalid ? "danger" : "default"} isRequired>
      <TimeField.Label>Начало смены</TimeField.Label>
      <TimeField.Control
        value={value}
        onValueChange={setValue}
        prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
      />
      <TimeField.Hint>Формат: ЧЧ:ММ (24 часа)</TimeField.Hint>
      {invalid ? <TimeField.Error>Укажите корректное время.</TimeField.Error> : null}
    </TimeField>
  );
}

function ValidatedTimeSimpleDemo({ initialValue = "25:00" }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  const invalid = value.length > 0 && !isValidTime(value);

  return (
    <TimeField
      label="Начало смены"
      hint="Формат: ЧЧ:ММ (24 часа)"
      error={invalid ? "Укажите корректное время." : undefined}
      status={invalid ? "danger" : "default"}
      isRequired
      value={value}
      onValueChange={setValue}
      prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
    />
  );
}

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

const meta = {
  title: "Core Components/TimeField",
  component: TimeField,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Поле ввода времени. **Simple** — `label`, `hint`, `error`, `prefix`, `suffix` и props контрола на root; **Compound** — `<TimeField.Label>` / `<TimeField.Control>` / `<TimeField.Hint>` / `<TimeField.Error>`. Варианты: `default`, `outline`, `segmented`. Prop `compact` — оболочка по ширине времени. **a11y:** `aria-describedby`, `aria-invalid` при `status=\"danger\"`, `role=\"spinbutton\"` на сегментах.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof TimeField>;

export default meta;
type Story = StoryObj<typeof meta>;

function DualApiDemo() {
  return (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props на &lt;TimeField&gt;">
        <TimeField
          label="Время встречи"
          hint="24-часовой формат"
          defaultValue="09:30"
          prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <TimeField>
          <TimeField.Label>Время встречи</TimeField.Label>
          <TimeField.Control
            defaultValue="09:30"
            prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
          />
          <TimeField.Hint>24-часовой формат</TimeField.Hint>
        </TimeField>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  );
}

export const Default: Story = {
  name: "Dual API",
  ...dualApiStorySource,
  render: () => <DualApiDemo />,
};

export const Segmented: Story = {
  name: "Segmented",
  render: () => {
    const [value, setValue] = useState("14:30");
    return (
      <TimeField>
        <TimeField.Label>Segmented</TimeField.Label>
        <TimeField.Control
          variant="segmented"
          value={value}
          onValueChange={setValue}
          prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
          suffix={
            <Text as="span" variant="small" className="text-muted">
              МСК
            </Text>
          }
        />
        <TimeField.Hint>Каждый сегмент — отдельная ячейка внутри оболочки.</TimeField.Hint>
      </TimeField>
    );
  },
};

export const Outline: Story = {
  name: "Outline",
  render: () => (
    <TimeField>
      <TimeField.Label>Outline</TimeField.Label>
      <TimeField.Control
        variant="outline"
        defaultValue="09:00"
        prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
      />
      <TimeField.Hint>Прозрачный фон оболочки — как у Input outline.</TimeField.Hint>
    </TimeField>
  ),
};

export const WithAffixes: Story = {
  name: "Prefix и suffix",
  render: () => (
    <TimeField>
      <TimeField.Label>Длительность</TimeField.Label>
      <TimeField.Control
        format="HH:mm:ss"
        defaultValue="01:30:00"
        prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
        suffix={
          <Text as="span" variant="small" className="font-medium text-muted">
            UTC+3
          </Text>
        }
      />
      <TimeField.Hint>Префикс и суффикс с отдельным фоном и разделителем.</TimeField.Hint>
    </TimeField>
  ),
};

export const Compact: Story = {
  name: "Компактный",
  render: () => (
    <div className="flex flex-col gap-mid">
      <TimeField label="Компактный" compact defaultValue="09:30" />
      <TimeField
        compact
        variant="segmented"
        defaultValue="14:15"
        prefix={<IoTimeOutline className="icon-small shrink-0" aria-hidden />}
      />
      <div className="flex flex-wrap items-end gap-small">
        <TimeField compact size="small" defaultValue="08:00" />
        <TimeField compact size="base" defaultValue="09:30" />
        <TimeField compact size="mid" defaultValue="14:15" />
      </div>
    </div>
  ),
};

export const WithSeconds: Story = {
  name: "С секундами",
  render: () => {
    const [value, setValue] = useState("12:30:45");
    return (
      <TimeField
        label="Точное время"
        format="HH:mm:ss"
        value={value}
        onValueChange={setValue}
        prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
      />
    );
  },
};

export const Validation: Story = {
  name: "Валидация (hint + error)",
  render: () => (
    <div className="flex w-full flex-col gap-plus">
      <p className="text-sm text-muted">
        Подсказка — <code className="text-accent">TimeField.Hint</code>; ошибка —{" "}
        <code className="text-accent">TimeField.Error</code> (
        <code className="text-accent">role=&quot;alert&quot;</code>). Оба id попадают в{" "}
        <code className="text-accent">aria-describedby</code> контрола.
      </p>
      <ValidatedTimeCompoundDemo />
      <ValidatedTimeSimpleDemo />
    </div>
  ),
};

export const Danger: Story = {
  name: "Danger",
  render: () => (
    <TimeField status="danger">
      <TimeField.Label>Время</TimeField.Label>
      <TimeField.Control defaultValue="25:00" />
      <TimeField.Error>Некорректное время.</TimeField.Error>
    </TimeField>
  ),
};

export const Success: Story = {
  render: () => (
    <TimeField status="success">
      <TimeField.Label>Время</TimeField.Label>
      <TimeField.Control defaultValue="09:00" />
      <TimeField.Hint>Сохранено.</TimeField.Hint>
    </TimeField>
  ),
};

export const Warning: Story = {
  render: () => (
    <TimeField status="warning">
      <TimeField.Label>Время</TimeField.Label>
      <TimeField.Control defaultValue="23:59" />
      <TimeField.Hint>Близко к концу рабочего дня.</TimeField.Hint>
    </TimeField>
  ),
};

export const Required: Story = {
  render: () => (
    <TimeField isRequired>
      <TimeField.Label>Начало</TimeField.Label>
      <TimeField.Control defaultValue="09:00" />
    </TimeField>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-plus">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <TimeField key={size} size={size}>
          <TimeField.Label>{size}</TimeField.Label>
          <TimeField.Control
            defaultValue="09:30"
            prefix={<IoTimeOutline className={cnIcon(size)} aria-hidden />}
          />
        </TimeField>
      ))}
    </div>
  ),
};

function cnIcon(size: "small" | "base" | "mid" | "large") {
  return size === "small" ? "icon-small shrink-0" : size === "mid" || size === "large" ? "icon-large shrink-0" : "icon-base shrink-0";
}

export const VariantsComparison: Story = {
  name: "Все варианты",
  render: () => (
    <div className="flex flex-col gap-mid">
      {(["default", "outline", "segmented"] as const).map((variant) => (
        <TimeField key={variant}>
          <TimeField.Label>{variant}</TimeField.Label>
          <TimeField.Control
            variant={variant}
            defaultValue="09:30"
            prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
          />
        </TimeField>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  name: "Отключён",
  render: () => (
    <TimeField label="Недоступно" defaultValue="09:30" disabled prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />} />
  ),
};
