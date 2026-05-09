import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./Input";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex flex-col items-center justify-center w-full p-8 text-b-text"
      style={{ backgroundColor: "var(--b-color-bg)" }}
    >
      <div className="mx-auto max-w-xl min-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-b-theme="light"
      className="box-border flex flex-col items-center justify-center w-full p-8 text-b-text"
      style={{ backgroundColor: "var(--b-color-bg)" }}
    >
      <div className="mx-auto max-w-xl min-w-md">
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
  },
  decorators: [...darkThemeDecorator],
  args: {
    variant: "default" as const,
    status: "default" as const,
    inputType: "text" as const,
    label: "Название поля",
    placeholder: "Введите значение",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
};

export const Outline: Story = {
  args: {
    variant: "outline",
    hint: "Вариант outline — прозрачный фон оболочки.",
  },
};

export const WithAffixes: Story = {
  args: {
    prefix: "https://",
    suffix: ".com",
    placeholder: "example",
    hint: "Префикс и суффикс с отдельным фоном и разделителем.",
  },
};

export const Destructive: Story = {
  args: {
    status: "destructive",
    defaultValue: "некорректно",
    hint: "Исправьте значение перед отправкой формы.",
  },
};

export const Success: Story = {
  args: {
    status: "success",
    defaultValue: "ok@example.com",
    hint: "Адрес подтверждён.",
  },
};

export const Warning: Story = {
  args: {
    status: "warning",
    defaultValue: "draft-v2",
    hint: "Этот идентификатор уже занят в другом проекте.",
  },
};

export const Password: Story = {
  args: {
    inputType: "password",
    label: "Пароль",
    placeholder: "••••••••",
    hint: "Не менее 8 символов.",
  },
};

export const NumberField: Story = {
  name: "Число",
  args: {
    inputType: "number",
    label: "Количество",
    placeholder: "0",
    hint: "Только целые числа.",
  },
};

export const FileUpload: Story = {
  name: "Файл",
  args: {
    inputType: "file",
    label: "Вложение",
    accept: "image/*,.pdf",
    multiple: true,
    placeholder: "Выберите изображение или PDF",
    hint: "Несколько файлов — списком в столбик; для изображений — превью у каждой строки.",
  },
};

export const WithoutHint: Story = {
  name: "Без примечания",
  args: {
    hint: undefined,
  },
};

export const OnLightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
  args: Default.args,
};
