import type { ComponentProps, ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoCheckmarkCircle, IoGlobeOutline } from "react-icons/io5";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
  dualApiStorySource,
} from "@/components/core/utils/dualApiStoryChrome";

import type { SelectorOption } from "./Selector";
import { Selector } from ".";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[18rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border flex min-h-[18rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const sampleOptions: SelectorOption[] = [
  {
    value: "ru",
    label: "Русский",
    description: "Интерфейс и уведомления на русском языке",
    icon: <IoGlobeOutline aria-hidden />,
  },
  {
    value: "en",
    label: "English",
    description: "UI and notifications in English",
    icon: <IoGlobeOutline aria-hidden />,
  },
  {
    value: "de",
    label: "Deutsch",
    description: "Nur Titel in der Auswahl; Beschreibung nur in der Liste",
    icon: <IoGlobeOutline aria-hidden />,
  },
];

const meta = {
  title: "Core Components/Selector",
  component: Selector,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Выпадающий выбор с полем поиска. **Simple** — props на root; **Compound** — `<Selector.Label>` / `<Selector.Control>` / `<Selector.Hint>` / `<Selector.Error>`. **a11y:** combobox + listbox, hint и error — `aria-describedby`, danger — `aria-invalid`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    size: { control: "select", options: ["small", "base", "mid", "large"] },
    variant: { control: "select", options: ["default", "outline"] },
    status: {
      control: "select",
      options: ["default", "danger", "success", "warning"],
    },
  },
} satisfies Meta<typeof Selector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple и Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props на &lt;Selector&gt;">
        <Selector
          label="Язык интерфейса"
          hint="В триггере — только название выбранного пункта."
          placeholder="Выберите язык"
          options={sampleOptions}
          defaultValue="ru"
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Selector>
          <Selector.Label>Язык интерфейса</Selector.Label>
          <Selector.Control
            options={sampleOptions}
            defaultValue="en"
            placeholder="Выберите язык"
          />
          <Selector.Hint>Описание пункта видно только в списке.</Selector.Hint>
        </Selector>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

type SelectorStoryProps = ComponentProps<typeof Selector>;

function ControlledSelector(props: SelectorStoryProps) {
  const [value, setValue] = useState("ru");
  return (
    <Selector
      {...props}
      value={value}
      onValueChange={setValue}
      options={props.options ?? sampleOptions}
    />
  );
}

export const Outline: Story = {
  render: () => (
    <ControlledSelector variant="outline" label="Язык интерфейса" placeholder="Выберите язык" />
  ),
};

export const Large: Story = {
  render: () => (
    <ControlledSelector size="mid" label="Размер mid" placeholder="Выберите язык" />
  ),
};

export const Disabled: Story = {
  render: () => (
    <Selector
      disabled
      value="en"
      label="Язык"
      options={sampleOptions}
      placeholder="Выберите язык"
    />
  ),
};

export const LongList: Story = {
  name: "Длинный список",
  render: function LongList() {
    const many: SelectorOption[] = Array.from({ length: 40 }, (_, i) => ({
      value: `opt-${i}`,
      label: `Пункт ${i + 1}`,
      description: i % 5 === 0 ? "С опциональным описанием в списке" : undefined,
      icon:
        i % 7 === 0 ? <IoCheckmarkCircle aria-hidden className="text-success" /> : undefined,
    }));
    const [value, setValue] = useState("opt-0");
    return (
      <Selector
        label="Много пунктов"
        hint="Прокрутка внутри панели; `menuMaxHeight` по умолчанию как у дропдауна."
        options={many}
        value={value}
        onValueChange={setValue}
        menuMaxHeight="min(12rem, 50vh)"
      />
    );
  },
};

export const LightTheme: Story = {
  decorators: [...lightThemeDecorator],
  render: () => (
    <ControlledSelector label="Язык интерфейса" hint="Светлая тема" placeholder="Выберите язык" />
  ),
};

export const Validation: Story = {
  name: "Валидация",
  render: () => (
    <Selector status="danger" isRequired>
      <Selector.Label>Язык интерфейса</Selector.Label>
      <Selector.Control options={sampleOptions} placeholder="Выберите язык" />
      <Selector.Hint>Язык влияет на интерфейс и письма.</Selector.Hint>
      <Selector.Error>Выберите язык из списка.</Selector.Error>
    </Selector>
  ),
};

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex flex-col gap-plus text-left">
      <p className="text-sm text-muted">
        <code className="text-accent">&lt;Label htmlFor&gt;</code> через{" "}
        <code className="text-accent">FieldLabelContext</code>. Combobox —{" "}
        <code className="text-accent">aria-expanded</code>,{" "}
        <code className="text-accent">aria-controls</code>,{" "}
        <code className="text-accent">aria-activedescendant</code>. Hint и error —{" "}
        <code className="text-accent">aria-describedby</code>; при{" "}
        <code className="text-accent">status=&quot;danger&quot;</code> —{" "}
        <code className="text-accent">aria-invalid</code> и{" "}
        <code className="text-accent">Selector.Error</code>.
      </p>
      <Selector status="danger" isRequired>
        <Selector.Label>Язык интерфейса</Selector.Label>
        <Selector.Control options={sampleOptions} placeholder="Выберите язык" />
        <Selector.Hint>Язык влияет на интерфейс и письма.</Selector.Hint>
        <Selector.Error>Выберите язык из списка.</Selector.Error>
      </Selector>
    </div>
  ),
};
