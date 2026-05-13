import type { ComponentType, FormEvent } from "react";
import { useCallback, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "@/components/core/Checkbox";
import { Button } from "@/components/core/Button/Button";
import { Input } from "@/components/core/Input/Input";
import type { SelectorOption } from "@/components/core/Selector";
import { Selector } from "@/components/core/Selector";
import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Form } from "./Form";

const localeOptions: SelectorOption[] = [
  {
    value: "ru",
    label: "Русский",
    description: "Интерфейс и письма на русском",
  },
  {
    value: "en",
    label: "English",
    description: "UI and emails in English",
  },
  {
    value: "de",
    label: "Deutsch",
    description: "Oberfläche und E-Mails auf Deutsch",
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
      <Selector
        label="Язык интерфейса"
        hint="В списке видно описание; в поле — только название."
        placeholder="Выберите язык"
        options={localeOptions}
        value={locale}
        onValueChange={setLocale}
      />
      <Input
        label="Имя"
        name="name"
        placeholder="Иван"
        autoComplete="name"
        isRequired
      />
      <Input
        label="Email"
        name="email"
        inputType="text"
        placeholder="you@example.com"
        autoComplete="email"
        isRequired
      />
      
      <Input
        label="Пароль"
        name="password"
        inputType="password"
        hint="Не менее 8 символов."
        autoComplete="new-password"
        isRequired
      />
      <Input
        label="Аватар"
        name="avatar"
        inputType="file"
        accept="image/*"
        placeholder="PNG или JPEG"
      />
      <CheckboxGroup
        title="Уведомления"
        description="Один канал: при выборе другого предыдущий снимается."
        selection="single"
        isRequired
      >
        <Checkbox name="channels" value="email" label="Email" />
        <Checkbox name="channels" value="push" label="Push в приложении" />
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
