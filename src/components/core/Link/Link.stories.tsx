import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { IoDocumentTextOutline, IoOpenOutline } from "react-icons/io5";

import { Text } from "@/components/core/Text";

import { Link } from "@/components/core/Link";

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

const lightDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Текстовая ссылка: по умолчанию `text-primary`; цвет можно переопределить через `className` (например `text-muted`). Стандартная иконка ↗ — `text-muted` до hover. Hover-lift и squeeze при нажатии. Опционально `underline`, иконки слева/справа или `showDefaultIcon`.",
      },
    },
  },
  decorators: [...framedDecorator],
  args: {
    href: "#",
    children: "Подробнее",
    size: "base",
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ClickInteraction: Story = {
  name: "Interaction: клик",
  args: {
    onClick: fn(),
  },
  render: (args) => (
    <Link
      {...args}
      onClick={(event) => {
        event.preventDefault();
        args.onClick?.(event);
      }}
    />
  ),
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("link", { name: "Подробнее" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const WithDefaultIcon: Story = {
  name: "Стандартная иконка",
  render: () => (
    <div className="flex flex-col items-center gap-mid">
      <Link href="#" showDefaultIcon defaultIconPosition="end">
        Дальше
      </Link>
      <Link href="#" showDefaultIcon defaultIconPosition="start">
        Назад к списку
      </Link>
    </div>
  ),
};

export const Underline: Story = {
  name: "С подчёркиванием",
  render: () => (
    <div className="flex flex-col items-center gap-mid">
      <Link href="#" underline>
        Подчёркнутая ссылка
      </Link>
      <Link href="#" underline showDefaultIcon>
        С иконкой
      </Link>
    </div>
  ),
};

export const CustomIcons: Story = {
  name: "Свои иконки",
  render: () => (
    <div className="flex flex-col items-center gap-mid">
      <Link href="#" leftIcon={<IoDocumentTextOutline aria-hidden className="icon-base" />}>
        Документация
      </Link>
      <Link href="https://example.com" rightIcon={<IoOpenOutline aria-hidden className="icon-base" />}>
        Открыть сайт
      </Link>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex flex-col items-start gap-small">
      <Link href="#" size="small" showDefaultIcon>
        small
      </Link>
      <Link href="#" size="base" showDefaultIcon>
        base
      </Link>
      <Link href="#" size="mid" showDefaultIcon>
        mid
      </Link>
      <Link href="#" size="large" showDefaultIcon>
        large
      </Link>
    </div>
  ),
};

export const InParagraph: Story = {
  name: "В тексте",
  render: () => (
    <Text as="p" variant="base" className="max-w-md text-center text-muted">
      Прочитайте{" "}
      <Link href="#" underline showDefaultIcon className="inline-flex align-baseline">
        руководство
      </Link>{" "}
      или перейдите в раздел настроек профиля.
    </Text>
  ),
};

export const LightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightDecorator],
  args: {
    showDefaultIcon: true,
    children: "Ссылка на светлом фоне",
  },
};

export const CustomClassNames: Story = {
  name: "Полная кастомизация classNames",
  parameters: {
    docs: {
      description: {
        story: "Слоты motion, anchor, text, iconStart и iconEnd через prop classNames.",
      },
    },
  },
  render: () => (
    <Link
      href="#"
      showDefaultIcon
      underline
      classNames={{
        motion: "rounded-mid border border-primary/20 p-xsmall",
        anchor: "gap-small text-info",
        text: "font-semibold",
        iconEnd: "text-warning",
      }}
    >
      Кастомная ссылка
    </Link>
  ),
};
