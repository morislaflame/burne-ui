import type { ComponentType, FormEvent } from "react";
import { useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/core/Button/Button";
import { Input } from "@/components/core/Input/Input";
import { Form } from "./Form";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex flex-col items-center justify-center w-full p-xlarge text-foreground"
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

  return (
    <Form onSubmit={onSubmit} aria-label="Пример формы">
      <Input
        label="Имя"
        name="name"
        placeholder="Иван"
        autoComplete="name"
      />
      <Input
        label="Email"
        name="email"
        inputType="text"
        placeholder="you@example.com"
        autoComplete="email"
      />
      <Input
        label="Пароль"
        name="password"
        inputType="password"
        hint="Не менее 8 символов."
        autoComplete="new-password"
      />
      <Input
        label="Аватар"
        name="avatar"
        inputType="file"
        accept="image/*"
        placeholder="PNG или JPEG"
        hint="Необязательно. Показывается превью для изображений."
      />
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
