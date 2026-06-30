import type { ComponentType, ChangeEvent } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/components/core/utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/components/core/utils/dualApiStorySource";

import { Input } from "./index";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function ValidatedEmailCompoundDemo({ initialValue = "bad@" }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  const invalid = value.length > 0 && !isValidEmail(value);

  return (
    <Input status={invalid ? "danger" : "default"} isRequired>
      <Input.Label>Email</Input.Label>
      <Input.Control
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        autoComplete="email"
      />
      <Input.Hint>Формат: name@domain.tld</Input.Hint>
      {invalid ? <Input.Error>Укажите корректный адрес.</Input.Error> : null}
    </Input>
  );
}

function ValidatedEmailSimpleDemo({ initialValue = "bad@" }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  const invalid = value.length > 0 && !isValidEmail(value);

  return (
    <Input
      label="Email"
      hint="Формат: name@domain.tld"
      error={invalid ? "Укажите корректный адрес." : undefined}
      status={invalid ? "danger" : "default"}
      isRequired
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      autoComplete="email"
    />
  );
}

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto min-w-sm">
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
      <div className="mx-auto min-w-sm">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Текстовое поле. **Simple** — `label`, `hint`, `error` и props контрола на root; **Compound** — `<Input.Label>` / `<Input.Control>` / `<Input.Hint>` / `<Input.Error>`. `variant=\"gloss\"` — стеклянная оболочка поля. **a11y:** `htmlFor`, `aria-describedby` (hint + error), `aria-invalid` при `status=\"danger\"`, `aria-required`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple и Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props на &lt;Input&gt;">
        <Input
          label="Email"
          hint="Мы не передаём адрес третьим лицам."
          placeholder="you@example.com"
          autoComplete="email"
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Input>
          <Input.Label>Email</Input.Label>
          <Input.Control placeholder="you@example.com" autoComplete="email" />
          <Input.Hint>Мы не передаём адрес третьим лицам.</Input.Hint>
        </Input>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const TypeInteraction: Story = {
  name: "Interaction: ввод",
  render: () => (
    <Input
      label="Email"
      placeholder="you@example.com"
      autoComplete="email"
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByRole("textbox", { name: "Email" });
    await userEvent.type(field, "test@example.com");
    await expect(field).toHaveValue("test@example.com");
  },
};

export const Outline: Story = {
  render: () => (
    <Input>
      <Input.Label>Сайт</Input.Label>
      <Input.Control variant="outline" placeholder="example.com" />
      <Input.Hint>Вариант outline — прозрачный фон оболочки.</Input.Hint>
    </Input>
  ),
};

export const WithAffixes: Story = {
  render: () => (
    <Input>
      <Input.Label>Домен</Input.Label>
      <Input.Control prefix="https://" suffix=".com" placeholder="example" />
      <Input.Hint>Префикс и суффикс с отдельным фоном и разделителем.</Input.Hint>
    </Input>
  ),
};

export const Danger: Story = {
  name: "Danger",
  render: () => (
    <Input status="danger">
      <Input.Label>Email</Input.Label>
      <Input.Control defaultValue="некорректно" />
      <Input.Error>Исправьте значение перед отправкой формы.</Input.Error>
    </Input>
  ),
};

export const Validation: Story = {
  name: "Валидация (hint + error)",
  render: () => (
    <div className="flex w-full flex-col gap-plus">
      <p className="text-sm text-muted">
        Подсказка — <code className="text-primary">Input.Hint</code> (muted); сообщение об ошибке —{" "}
        <code className="text-primary">Input.Error</code> (danger, <code className="text-primary">role=&quot;alert&quot;</code>
        ). Оба id попадают в <code className="text-primary">aria-describedby</code> контрола. Ошибка
        снимается при вводе корректного email.
      </p>
      <ValidatedEmailCompoundDemo />
      <ValidatedEmailSimpleDemo />
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <Input status="success">
      <Input.Label>Email</Input.Label>
      <Input.Control defaultValue="ok@example.com" />
      <Input.Hint>Адрес подтверждён.</Input.Hint>
    </Input>
  ),
};

export const Warning: Story = {
  render: () => (
    <Input status="warning">
      <Input.Label>Slug</Input.Label>
      <Input.Control defaultValue="draft-v2" />
      <Input.Hint>Этот идентификатор уже занят в другом проекте.</Input.Hint>
    </Input>
  ),
};

export const Required: Story = {
  render: () => (
    <Input isRequired>
      <Input.Label>Имя</Input.Label>
      <Input.Control placeholder="Иван" autoComplete="name" />
    </Input>
  ),
};

export const Password: Story = {
  render: () => (
    <Input>
      <Input.Label>Пароль</Input.Label>
      <Input.Control inputType="password" placeholder="••••••••" autoComplete="current-password" />
      <Input.Hint>Не менее 8 символов.</Input.Hint>
    </Input>
  ),
};

export const File: Story = {
  render: () => (
    <Input>
      <Input.Label>Аватар</Input.Label>
      <Input.Control inputType="file" accept="image/*" />
    </Input>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-plus">
      <Input size="small">
        <Input.Label>Small</Input.Label>
        <Input.Control placeholder="small" />
      </Input>
      <Input size="base">
        <Input.Label>Base</Input.Label>
        <Input.Control placeholder="base" />
      </Input>
      <Input size="mid">
        <Input.Label>Mid</Input.Label>
        <Input.Control placeholder="mid" />
      </Input>
      <Input size="large">
        <Input.Label>Large</Input.Label>
        <Input.Control placeholder="large" />
      </Input>
    </div>
  ),
};

export const LightTheme: Story = {
  decorators: [...lightThemeDecorator],
  render: () => (
    <Input>
      <Input.Label>Email</Input.Label>
      <Input.Control placeholder="you@example.com" />
    </Input>
  ),
};

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex flex-col gap-plus text-left">
      <p className="text-sm text-muted">
        <code className="text-primary">&lt;Label htmlFor&gt;</code> через{" "}
        <code className="text-primary">FieldLabelContext</code>. Hint и error — через{" "}
        <code className="text-primary">aria-describedby</code> (оба id, если заданы). При{" "}
        <code className="text-primary">status=&quot;danger&quot;</code> —{" "}
        <code className="text-primary">aria-invalid</code> на контроле; ошибка —{" "}
        <code className="text-primary">Input.Error</code>, не tinted hint.
      </p>
      <ValidatedEmailCompoundDemo />
    </div>
  ),
};

// ─── Gloss variant ───────────────────────────────────────────────────────────

const dottedGridStyle = {
  backgroundImage: "radial-gradient(rgb(128 128 128 / 0.22) 1px, transparent 1px)",
  backgroundSize: "30px 30px",
  backgroundPosition: "2px 2px",
} as const;

function glossDottedDecorator(light = false) {
  return (Story: ComponentType) => (
    <div
      data-theme={light ? "light" : undefined}
      className="box-border flex min-h-[22rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)", ...dottedGridStyle }}
    >
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  );
}

function GlossDemo() {
  return (
    <div className="flex w-full flex-col gap-plus">
      <Input>
        <Input.Label>Email</Input.Label>
        <Input.Control variant="gloss" placeholder="you@example.com" autoComplete="email" />
        <Input.Hint>variant=&quot;gloss&quot; — стеклянная оболочка поля.</Input.Hint>
      </Input>
      <Input>
        <Input.Label>Домен</Input.Label>
        <Input.Control variant="gloss" prefix="https://" suffix=".com" placeholder="example" />
      </Input>
      <Input>
        <Input.Label>Пароль</Input.Label>
        <Input.Control
          variant="gloss"
          inputType="password"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </Input>
      <div className="flex flex-col gap-base">
        <Input size="small">
          <Input.Label>Small</Input.Label>
          <Input.Control variant="gloss" placeholder="small" />
        </Input>
        <Input size="base">
          <Input.Label>Base</Input.Label>
          <Input.Control variant="gloss" placeholder="base" />
        </Input>
        <Input size="mid">
          <Input.Label>Mid</Input.Label>
          <Input.Control variant="gloss" placeholder="mid" />
        </Input>
        <Input size="large">
          <Input.Label>Large</Input.Label>
          <Input.Control variant="gloss" placeholder="large" />
        </Input>
      </div>
      <Input status="danger">
        <Input.Label>Email</Input.Label>
        <Input.Control variant="gloss" defaultValue="bad@" />
        <Input.Error>Укажите корректный адрес.</Input.Error>
      </Input>
      <Input disabled>
        <Input.Label>Disabled</Input.Label>
        <Input.Control variant="gloss" defaultValue="readonly@example.com" />
      </Input>
    </div>
  );
}

export const Gloss: Story = {
  name: "Gloss",
  parameters: { controls: { disable: true } },
  decorators: [glossDottedDecorator(false)],
  render: () => <GlossDemo />,
};

export const GlossLight: Story = {
  name: "Gloss — светлая тема",
  parameters: { controls: { disable: true } },
  decorators: [glossDottedDecorator(true)],
  render: () => <GlossDemo />,
};

export const CustomClassNames: Story = {
  name: "Полная кастомизация classNames",
  parameters: {
    docs: {
      description: {
        story: "кастомизация classNames для Input",
      },
    },
  },
  render: () => (
    <Input
      className="max-w-sm"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        shell: "ring-1 ring-primary/15",
        control: "text-primary placeholder:text-primary/50",
        hint: "text-foreground/70",
        error: "font-medium",
      }}
      label="Email"
      placeholder="you@example.com"
      status="danger"
      hint="Мы не передаём адрес третьим лицам."
      error="Введите корректный email."
    />
  ),
};
