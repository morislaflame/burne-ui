import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Expandable } from "./Expandable";

const PIN_IMAGE =
  "https://i.pinimg.com/736x/89/e2/85/89e285ca1fc973db199bf395f7c89669.jpg";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border w-full p-8 text-b-text"
      style={{ backgroundColor: "var(--b-color-bg)" }}
    >
      <div className="mx-auto w-full max-w-lg">
        <Story />
      </div>
    </div>
  ),
] as const;

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-b-theme="light"
      className="box-border w-full p-8 text-b-text"
      style={{ backgroundColor: "var(--b-color-bg)" }}
    >
      <div className="mx-auto w-full max-w-lg">
        <Story />
      </div>
    </div>
  ),
] as const;

const infoIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const meta = {
  title: "Core Components/Expandable",
  component: Expandable,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false,
      table: {
        type: { summary: "ReactNode" },
      },
    },
    icon: {
      control: false,
      table: {
        type: { summary: "ReactNode" },
      },
    },
    title: {
      table: {
        type: { summary: "ReactNode" },
      },
    },
    description: {
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof Expandable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Заголовок",
    children: (
      <p className="text-sm leading-relaxed text-b-muted">
        Любой контент: текст, списки, вложенные блоки. Высота панели подстраивается
        под содержимое.
      </p>
    ),
  },
};

export const WithIcon: Story = {
  name: "С иконкой",
  args: {
    icon: infoIcon,
    title: "Уведомления",
    children: (
      <p className="text-sm text-b-muted">
        Иконка выровнена по верху вместе с заголовком.
      </p>
    ),
  },
};

export const WithImage: Story = {
  name: "С изображением",
  args: {
    title: "Progress is a mindset",
    description: "Редакционный кадр в раскрывающемся блоке.",
    defaultOpen: true,
    children: (
      <img
        src={PIN_IMAGE}
        alt="Портрет в глянцевом красном шлеме, текст на визоре"
        className="w-full max-h-[min(420px,55vh)] rounded-b-md object-cover"
        loading="lazy"
      />
    ),
  },
};

export const PressRipple: Story = {
  name: "Риппл по нажатию",
  args: {
    title: "Нажми на заголовок",
    description: "Converge-ripple включается опционально через pressRipple.",
    pressRipple: true,
    children: (
      <p className="text-sm text-b-muted">
        Отдельный режим для компонентов с акцентом на click-feedback.
      </p>
    ),
  },
};

export const AllVariationsLight: Story = {
  name: "Все варианты — светлая тема",
  args: { title: "—" },
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex flex-col gap-4">
      <Expandable
        title="Только заголовок"
        children={<p className="text-sm text-b-muted">Контент без описания в триггере.</p>}
      />
      <Expandable
        title="С описанием"
        description="Дополнительная строка под заголовком."
        children={<p className="text-sm text-b-muted">Текст внутри панели.</p>}
      />
      <Expandable
        icon={infoIcon}
        title="С иконкой"
        description="Иконка слева."
        children={<p className="text-sm text-b-muted">Контент.</p>}
      />
      <Expandable
        title="С изображением"
        description="По умолчанию развёрнуто."
        defaultOpen
      >
        <img
          src={PIN_IMAGE}
          alt=""
          className="w-full max-h-[min(320px,40vh)] rounded-b-md object-cover"
          loading="lazy"
        />
      </Expandable>
    </div>
  ),
};
