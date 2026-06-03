import type { ComponentType, FormEvent } from "react";
import { useCallback, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "@/components/core/Checkbox";
import { Button } from "@/components/core/Button/Button";
import { Input } from "@/components/core/Input";
import type { ComboBoxOption } from "@/components/core/ComboBox";
import { ComboBox } from "@/components/core/ComboBox";
import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Form } from "./Form";

const localeOptions: ComboBoxOption[] = [
  {
    value: "ru",
    label: "Русский",
    hint: "Интерфейс и письма на русском",
  },
  {
    value: "en",
    label: "English",
    hint: "UI and emails in English",
  },
  {
    value: "de",
    label: "Deutsch",
    hint: "Oberfläche und E-Mails auf Deutsch",
  },
];

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
  title: "Composite Components/Form",
  component: Form,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

function ProfileForm() {
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  const [locale, setLocale] = useState("ru");

  return (
    <Form onSubmit={onSubmit} aria-label="Пример формы">
      <ComboBox options={localeOptions} value={locale} onValueChange={setLocale}>
        <ComboBox.Label>Язык интерфейса</ComboBox.Label>
        <ComboBox.InputGroup>
          <ComboBox.Input placeholder="Выберите язык" />
          <ComboBox.Trigger />
        </ComboBox.InputGroup>
        <ComboBox.Popover />
        <ComboBox.Hint>В списке видно описание; в поле — только название.</ComboBox.Hint>
      </ComboBox>
      <Input isRequired>
        <Input.Label>Имя</Input.Label>
        <Input.Control name="name" placeholder="Иван" autoComplete="name" />
      </Input>
      <Input isRequired>
        <Input.Label>Email</Input.Label>
        <Input.Control
          name="email"
          inputType="text"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </Input>
      <Input isRequired>
        <Input.Label>Пароль</Input.Label>
        <Input.Control
          name="password"
          inputType="password"
          autoComplete="new-password"
        />
        <Input.Hint>Не менее 8 символов.</Input.Hint>
      </Input>
      <Input>
        <Input.Label>Аватар</Input.Label>
        <Input.Control name="avatar" inputType="file" accept="image/*" placeholder="PNG или JPEG" />
      </Input>
      <CheckboxGroup selection="single" isRequired>
        <CheckboxGroup.Legend>
          <CheckboxGroup.Label>Уведомления</CheckboxGroup.Label>
          <CheckboxGroup.Hint>
            Один канал: при выборе другого предыдущий снимается.
          </CheckboxGroup.Hint>
        </CheckboxGroup.Legend>
        <CheckboxGroup.List>
          <Checkbox name="channels" value="email" label="Email" />
          <Checkbox name="channels" value="push" label="Push в приложении" />
        </CheckboxGroup.List>
      </CheckboxGroup>
      <div className="flex justify-end gap-plus pt-base">
        <Button type="button" variant="outline" size="base">
          Отмена
        </Button>
        <Button type="submit" variant="default" size="base">
          Сохранить
        </Button>
      </div>
    </Form>
  );
}

export const Default: Story = {
  render: () => <ProfileForm />,
};

function ValidationForm() {
  const [email, setEmail] = useState("bad@");
  const emailInvalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Form onSubmit={onSubmit} aria-label="Форма с ошибками валидации">
      <Input status={emailInvalid ? "danger" : "default"} isRequired>
        <Input.Label>Email</Input.Label>
        <Input.Control
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
        />
        <Input.Hint>Формат: name@domain.tld</Input.Hint>
        {emailInvalid ? <Input.Error>Укажите корректный адрес.</Input.Error> : null}
      </Input>
      <ComboBox status="danger" isRequired options={localeOptions}>
        <ComboBox.Label>Язык интерфейса</ComboBox.Label>
        <ComboBox.InputGroup>
          <ComboBox.Input placeholder="Выберите язык" />
          <ComboBox.Trigger />
        </ComboBox.InputGroup>
        <ComboBox.Popover />
        <ComboBox.Error>Выберите язык из списка.</ComboBox.Error>
      </ComboBox>
      <Checkbox
        danger
        label="Согласие на обработку данных"
        error="Необходимо принять условия."
      />
      <div className="flex justify-end gap-plus pt-base">
        <Button type="submit" variant="default" size="base">
          Отправить
        </Button>
      </div>
    </Form>
  );
}

export const Validation: Story = {
  name: "Валидация полей",
  render: () => <ValidationForm />,
};
