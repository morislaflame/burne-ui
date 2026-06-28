import type { ComponentType, ChangeEvent } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Button } from "@/components/core/Button";
import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";
import { Label } from "@/components/core/Label";
import { COMPONENT_SIZES } from "@/components/core/utils/componentSize";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Примитивы поля формы: **Field.Root**, **Field.Label**, **Field.Hint**, **Field.Error**, **Field.Set** (+ **Field.Group**, **Field.Actions**). Используются внутри Input, ComboBox, Meter и др.; можно собирать поля вручную.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RootWithHintAndError: Story = {
  name: "Root + Label + Hint + Error",
  render: () => (
    <Field className="max-w-sm">
      <Field.Label htmlFor="field-email">Email</Field.Label>
      <Input.Control id="field-email" placeholder="you@example.com" status="danger" />
      <Field.Hint>Мы не передаём адрес третьим лицам.</Field.Hint>
      <Field.Error>Введите корректный email.</Field.Error>
    </Field>
  ),
};

export const FieldSetGroup: Story = {
  name: "FieldSet + Group + Actions",
  render: () => (
    <Field.Set className="max-w-md">
      <Field.Legend>
        <Field.LegendHeader>
          <Label>Контактные данные</Label>
          <Field.Hint as="span">Все поля обязательны</Field.Hint>
        </Field.LegendHeader>
      </Field.Legend>
      <Field.Group>
        <Input>
          <Input.Label>Телефон</Input.Label>
          <Input.Control placeholder="+7 …" />
        </Input>
        <Input status="danger">
          <Input.Label>Email</Input.Label>
          <Input.Control defaultValue="bad@" />
          <Input.Error>Некорректный адрес.</Input.Error>
        </Input>
        <Field.Error>Исправьте ошибки перед продолжением.</Field.Error>
      </Field.Group>
      <Field.Actions>
        <Button type="submit" size="base">
          Сохранить
        </Button>
        <Button type="button" variant="ghost" size="base">
          Отмена
        </Button>
      </Field.Actions>
    </Field.Set>
  ),
};

function FieldSetSizeDemo({ size }: { size: (typeof COMPONENT_SIZES)[number] }) {
  return (
    <Field.Set size={size} className="max-w-md">
      <Field.Legend>
        <Field.LegendHeader>
          <Label>Контактные данные</Label>
          <Field.Hint as="span">size={size}</Field.Hint>
        </Field.LegendHeader>
      </Field.Legend>
      <Field.Group>
        <Input>
          <Input.Label>Телефон</Input.Label>
          <Input.Control placeholder="+7 …" />
        </Input>
        <Input>
          <Input.Label>Email</Input.Label>
          <Input.Control placeholder="you@example.com" />
        </Input>
        <Field.Error>Пример групповой ошибки.</Field.Error>
      </Field.Group>
      <Field.Actions>
        <Button type="button" size="base">
          Сохранить
        </Button>
        <Button type="button" variant="ghost" size="base">
          Отмена
        </Button>
      </Field.Actions>
    </Field.Set>
  );
}

export const FieldSetSizes: Story = {
  name: "FieldSet — размеры",
  render: () => (
    <div className="grid w-full max-w-5xl gap-xlarge md:grid-cols-2">
      {COMPONENT_SIZES.map((size) => (
        <div key={size} className="flex flex-col gap-base">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">{size}</span>
          <FieldSetSizeDemo size={size} />
        </div>
      ))}
    </div>
  ),
};

export const HintStatuses: Story = {
  name: "Hint — статусы",
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-mid">
      <Field>
        <Field.Label>По умолчанию</Field.Label>
        <Field.Hint>Нейтральная подсказка (muted).</Field.Hint>
      </Field>
      <Field>
        <Field.Label>Успех</Field.Label>
        <Field.Hint status="success">Значение сохранено.</Field.Hint>
      </Field>
      <Field>
        <Field.Label>Предупреждение</Field.Label>
        <Field.Hint status="warning">Проверьте данные перед отправкой.</Field.Hint>
      </Field>
      <Field>
        <Field.Label>Ошибка (Hint)</Field.Label>
        <Field.Hint status="danger">Hint со status=danger — для редких кейсов.</Field.Hint>
      </Field>
      <Field>
        <Field.Label>Ошибка (Error)</Field.Label>
        <Field.Error>Field.Error — основной паттерн для ошибок.</Field.Error>
      </Field>
    </div>
  ),
};

export const WithForm: Story = {
  name: "Внутри Form",
  render: function WithFormStory() {
    const [email, setEmail] = useState("");
    const emailInvalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    return (
      <form
        className="flex w-full max-w-sm flex-col gap-mid text-left"
        aria-label="Демо форма"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input label="Имя" placeholder="Иван" />
        <Input
          label="Email"
          placeholder="you@example.com"
          hint="Формат: name@domain.tld"
          error={emailInvalid ? "Некорректный адрес" : undefined}
          status={emailInvalid ? "danger" : "default"}
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <Button type="submit" size="base">
          Отправить
        </Button>
      </form>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText("Имя"), "Анна");
    await userEvent.click(canvas.getByRole("button", { name: "Отправить" }));
    await expect(canvas.getByLabelText("Имя")).toHaveValue("Анна");
  },
};
