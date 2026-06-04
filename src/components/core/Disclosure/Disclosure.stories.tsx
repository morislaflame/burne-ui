import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoInformationCircleOutline, IoLockClosedOutline, IoNotificationsOutline } from "react-icons/io5";

import { Text } from "@/components/core/Text";

import { Disclosure, DisclosureGroup } from "./Disclosure";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[22rem] w-full flex-col items-center justify-start gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-lg">
        <Story />
      </div>
    </div>
  ),
];

const meta = {
  title: "Core Components/Disclosure",
  component: Disclosure,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Компонент раскрытия/скрытия контента с анимацией. **Варианты**: `default` (разделитель), `outline` / `secondary` (триггер снаружи, рамка только у контента), `card` (единая карточка), `ghost`. Hover-lift и squeeze на триггере. `DisclosureGroup` — аккордеон и `separated`.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

const bodyText =
  "Это контент, который появляется при раскрытии блока. Анимация высоты реализована через anime.js с плавным эзингом. Содержимое может быть любым — текст, компоненты, списки.";

// ─── Basic ───────────────────────────────────────────────────────────────────

export const Basic: Story = {
  name: "Базовый",
  render: () => (
    <Disclosure defaultOpen>
      <Disclosure.Trigger>Основная информация</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
      </Disclosure.Content>
    </Disclosure>
  ),
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Variants: Story = {
  name: "Варианты",
  render: () => (
    <div className="flex flex-col gap-mid">
      {(["default", "outline", "secondary", "card", "ghost"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-xsmall">
          <Text as="p" variant="small" className="text-muted capitalize">{variant}</Text>
          <Disclosure variant={variant} defaultOpen>
            <Disclosure.Trigger>Заголовок ({variant})</Disclosure.Trigger>
            <Disclosure.Content>
              <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
            </Disclosure.Content>
          </Disclosure>
        </div>
      ))}
    </div>
  ),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex flex-col gap-mid">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <Disclosure key={size} variant="outline" size={size}>
          <Disclosure.Trigger>Размер: {size}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </div>
  ),
};

// ─── Icon position ────────────────────────────────────────────────────────────

export const IconPosition: Story = {
  name: "Позиция иконки",
  render: () => (
    <div className="flex flex-col gap-small">
      <Disclosure variant="outline" iconPos="right" defaultOpen>
        <Disclosure.Trigger>Иконка справа (по умолчанию)</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
        </Disclosure.Content>
      </Disclosure>
      <Disclosure variant="outline" iconPos="left">
        <Disclosure.Trigger>Иконка слева</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
        </Disclosure.Content>
      </Disclosure>
      <Disclosure variant="outline" iconPos="right">
        <Disclosure.Trigger icon={<IoInformationCircleOutline className="size-full" />}>
          Кастомная иконка
        </Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
        </Disclosure.Content>
      </Disclosure>
      <Disclosure variant="outline" iconPos="right">
        <Disclosure.Trigger icon={null}>Без иконки</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
        </Disclosure.Content>
      </Disclosure>
    </div>
  ),
};

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  name: "Контролируемый",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col gap-mid">
        <div className="flex gap-small">
          <button
            type="button"
            className="text-small text-accent underline"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Свернуть" : "Развернуть"} извне
          </button>
        </div>
        <Disclosure variant="outline" open={open} onOpenChange={setOpen}>
          <Disclosure.Trigger>Контролируемый блок</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      </div>
    );
  },
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  name: "Отключён",
  render: () => (
    <Disclosure variant="outline" disabled>
      <Disclosure.Trigger>Недоступный блок</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
      </Disclosure.Content>
    </Disclosure>
  ),
};

// ─── DisclosureGroup: Default ─────────────────────────────────────────────────

export const GroupDefault: Story = {
  name: "DisclosureGroup — default",
  render: () => (
    <DisclosureGroup variant="default">
      {[
        { value: "a", title: "Что такое компонент Disclosure?",   icon: <IoInformationCircleOutline /> },
        { value: "b", title: "Как использовать в проекте?",        icon: <IoNotificationsOutline /> },
        { value: "c", title: "Есть ли режим аккордеона?",          icon: <IoLockClosedOutline /> },
      ].map(({ value, title, icon }) => (
        <Disclosure key={value} value={value}>
          <Disclosure.Trigger icon={icon}>{title}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </DisclosureGroup>
  ),
};

// ─── DisclosureGroup: Outline ─────────────────────────────────────────────────

export const GroupSecondary: Story = {
  name: "DisclosureGroup — secondary",
  render: () => (
    <DisclosureGroup variant="secondary" defaultValue="a">
      {["a", "b", "c"].map((v) => (
        <Disclosure key={v} value={v}>
          <Disclosure.Trigger>Раздел {v.toUpperCase()}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </DisclosureGroup>
  ),
};

export const GroupOutline: Story = {
  name: "DisclosureGroup — outline",
  render: () => (
    <DisclosureGroup variant="outline" defaultValue="a">
      {["a", "b", "c"].map((v) => (
        <Disclosure key={v} value={v}>
          <Disclosure.Trigger>Раздел {v.toUpperCase()}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </DisclosureGroup>
  ),
};

// ─── DisclosureGroup: Card ────────────────────────────────────────────────────

export const GroupCard: Story = {
  name: "DisclosureGroup — card",
  render: () => (
    <DisclosureGroup variant="card" defaultValue="b">
      {["a", "b", "c"].map((v) => (
        <Disclosure key={v} value={v}>
          <Disclosure.Trigger>Элемент {v.toUpperCase()}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </DisclosureGroup>
  ),
};

// ─── DisclosureGroup: Separated ──────────────────────────────────────────────

export const FramedVariantsClosed: Story = {
  name: "Outline / Secondary — закрыты",
  render: () => (
    <div className="flex flex-col gap-mid">
      <Disclosure variant="outline">
        <Disclosure.Trigger>Outline — заголовок вне рамки</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
        </Disclosure.Content>
      </Disclosure>
      <Disclosure variant="secondary">
        <Disclosure.Trigger>Secondary — заголовок вне рамки</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
        </Disclosure.Content>
      </Disclosure>
    </div>
  ),
};

export const GroupSeparated: Story = {
  name: "DisclosureGroup — separated",
  render: () => (
    <DisclosureGroup variant="outline" separated defaultValue="a">
      {["a", "b", "c"].map((v) => (
        <Disclosure key={v} value={v}>
          <Disclosure.Trigger>Раздел {v.toUpperCase()}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </DisclosureGroup>
  ),
};

// ─── DisclosureGroup: Separated Card ─────────────────────────────────────────

export const GroupSeparatedCard: Story = {
  name: "DisclosureGroup — separated cards",
  render: () => (
    <DisclosureGroup variant="card" separated defaultValue="a">
      {["a", "b", "c"].map((v) => (
        <Disclosure key={v} value={v}>
          <Disclosure.Trigger>Карточка {v.toUpperCase()}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </DisclosureGroup>
  ),
};

// ─── DisclosureGroup: Non-accordion ──────────────────────────────────────────

export const GroupNonAccordion: Story = {
  name: "DisclosureGroup — несколько открытых",
  render: () => (
    <DisclosureGroup variant="outline" accordion={false}>
      {["a", "b", "c"].map((v) => (
        <Disclosure key={v} value={v} defaultOpen={v === "a" || v === "b"}>
          <Disclosure.Trigger>Раздел {v.toUpperCase()}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </DisclosureGroup>
  ),
};

// ─── DisclosureGroup: Controlled ─────────────────────────────────────────────

export const GroupControlled: Story = {
  name: "DisclosureGroup — контролируемый",
  render: () => {
    const [value, setValue] = useState<string | null>("a");
    return (
      <div className="flex flex-col gap-mid">
        <div className="flex gap-small">
          {["a", "b", "c"].map((v) => (
            <button
              key={v}
              type="button"
              className={`text-small underline ${value === v ? "text-accent font-medium" : "text-muted"}`}
              onClick={() => setValue(value === v ? null : v)}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
        <DisclosureGroup variant="outline" value={value} onValueChange={setValue}>
          {["a", "b", "c"].map((v) => (
            <Disclosure key={v} value={v}>
              <Disclosure.Trigger>Раздел {v.toUpperCase()}</Disclosure.Trigger>
              <Disclosure.Content>
                <Text as="p" variant="small" className="text-muted">{bodyText}</Text>
              </Disclosure.Content>
            </Disclosure>
          ))}
        </DisclosureGroup>
      </div>
    );
  },
};
