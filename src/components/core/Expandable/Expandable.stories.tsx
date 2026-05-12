import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Ripple } from "@/components/core/Ripple";

import { Expandable } from "./Expandable";

const PIN_IMAGE =
  "https://i.pinimg.com/736x/89/e2/85/89e285ca1fc973db199bf395f7c89669.jpg";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
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
      data-theme="light"
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
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
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof Expandable>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Составление: корень → Trigger (иконка, текст, Chevron при необходимости) → Panel. */
export const Default: Story = {
  render: () => (
    <Expandable>
      <Expandable.Trigger>
        <Expandable.Content>
          <Expandable.Title>Заголовок</Expandable.Title>
        </Expandable.Content>
      </Expandable.Trigger>
      <Expandable.Panel>
        <p className="text-sm leading-relaxed">
          Любой контент: текст, списки, вложенные блоки. Высота панели подстраивается под
          содержимое.
        </p>
      </Expandable.Panel>
    </Expandable>
  ),
};

export const WithIcon: Story = {
  name: "С иконкой",
  render: () => (
    <Expandable>
      <Expandable.Trigger>
        <Expandable.Icon>{infoIcon}</Expandable.Icon>
        <Expandable.Content>
          <Expandable.Title>Уведомления</Expandable.Title>
        </Expandable.Content>
      </Expandable.Trigger>
      <Expandable.Panel>
        <p className="text-sm">
          Иконка выровнена по верху вместе с заголовком.
        </p>
      </Expandable.Panel>
    </Expandable>
  ),
};

export const WithImage: Story = {
  name: "С изображением",
  render: () => (
    <Expandable defaultOpen>
      <Expandable.Trigger>
        <Expandable.Content>
          <Expandable.Title>Progress is a mindset</Expandable.Title>
          <Expandable.Description>Редакционный кадр в раскрывающемся блоке.</Expandable.Description>
        </Expandable.Content>
      </Expandable.Trigger>
      <Expandable.Panel>
        <img
          src={PIN_IMAGE}
          alt="Портрет в глянцевом красном шлеме, текст на визоре"
          className="w-full max-h-[min(420px,55vh)] rounded-mid object-cover"
          loading="lazy"
        />
      </Expandable.Panel>
    </Expandable>
  ),
};

export const PressRipple: Story = {
  name: "Риппл по нажатию",
  render: () => (
    <Expandable>
      <Expandable.Trigger>
        <Ripple color="accentMuted" />
        <Expandable.Content>
          <Expandable.Title>Нажми на строку заголовка</Expandable.Title>
          <Expandable.Description>
            Ripple среди детей триггера — слой на всю кнопку (включая шеврон):{" "}
            <code className="text-xs">
              {`<Ripple color="accentMuted" />`}
            </code>
          </Expandable.Description>
        </Expandable.Content>
      </Expandable.Trigger>
      <Expandable.Panel>
        <p className="text-sm">
          Отдельный режим для компонентов с акцентом на click-feedback.
        </p>
      </Expandable.Panel>
    </Expandable>
  ),
};

export const AllVariationsLight: Story = {
  name: "Все варианты — светлая тема",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex flex-col gap-mid">
      <Expandable>
        <Expandable.Trigger>
          <Expandable.Content>
            <Expandable.Title>Только заголовок</Expandable.Title>
          </Expandable.Content>
        </Expandable.Trigger>
        <Expandable.Panel>
          <p className="text-sm">Контент без описания в триггере.</p>
        </Expandable.Panel>
      </Expandable>

      <Expandable>
        <Expandable.Trigger>
          <Expandable.Content>
            <Expandable.Title>С описанием</Expandable.Title>
            <Expandable.Description>
              Дополнительная строка под заголовком.
            </Expandable.Description>
          </Expandable.Content>
        </Expandable.Trigger>
        <Expandable.Panel>
          <p className="text-sm">Текст внутри панели.</p>
        </Expandable.Panel>
      </Expandable>

      <Expandable>
        <Expandable.Trigger>
          <Expandable.Icon>{infoIcon}</Expandable.Icon>
          <Expandable.Content>
            <Expandable.Title>С иконкой</Expandable.Title>
            <Expandable.Description>Иконка слева.</Expandable.Description>
          </Expandable.Content>
        </Expandable.Trigger>
        <Expandable.Panel>
          <p className="text-sm">Контент.</p>
        </Expandable.Panel>
      </Expandable>

      <Expandable defaultOpen>
        <Expandable.Trigger>
          <Expandable.Content>
            <Expandable.Title>С изображением</Expandable.Title>
            <Expandable.Description>По умолчанию развёрнуто.</Expandable.Description>
          </Expandable.Content>
        </Expandable.Trigger>
        <Expandable.Panel>
          <img
            src={PIN_IMAGE}
            alt=""
            className="w-full max-h-[min(320px,40vh)] rounded-mid object-cover"
            loading="lazy"
          />
        </Expandable.Panel>
      </Expandable>
    </div>
  ),
};
