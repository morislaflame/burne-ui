import type { ComponentProps, ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoCheckmarkCircle, IoGlobeOutline } from "react-icons/io5";

import { ListBox } from "@/components/core/ListBox";
import {
  DualApiStoryPanel,
  DualApiStoryPanels,
  dualApiStorySource,
} from "@/components/core/utils/dualApiStoryChrome";
import { OptionListItemLayoutShowcase } from "@/components/core/utils/optionListItemStoryLayouts";

import type { ComboBoxOption } from "./ComboBox";
import { ComboBox } from ".";

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

const sampleOptions: ComboBoxOption[] = [
  {
    value: "ru",
    label: "Русский",
    hint: "Интерфейс и уведомления на русском языке",
    icon: <IoGlobeOutline aria-hidden />,
  },
  {
    value: "en",
    label: "English",
    hint: "UI and notifications in English",
    icon: <IoGlobeOutline aria-hidden />,
  },
  {
    value: "de",
    label: "Deutsch",
    hint: "Nur Titel in der Auswahl; подсказка только в списке",
    icon: <IoGlobeOutline aria-hidden />,
  },
];

const meta = {
  title: "Core Components/ComboBox",
  component: ComboBox,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Combobox с поиском. **Simple** — `options` на root; **Compound** — `<ComboBox.Label>`, `<ComboBox.InputGroup>` + `<ComboBox.Input>` / `<ComboBox.Trigger>`, `<ComboBox.Popover>` с `<ListBox>`. Панель — через `Popover`.",
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
} satisfies Meta<typeof ComboBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple и Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props на &lt;ComboBox&gt;">
        <ComboBox
          label="Язык интерфейса"
          hint="В поле — только название выбранного пункта."
          placeholder="Выберите язык"
          options={sampleOptions}
          defaultValue="ru"
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <ComboBox options={sampleOptions} defaultValue="en">
          <ComboBox.Label>Язык интерфейса</ComboBox.Label>
          <ComboBox.InputGroup>
            <ComboBox.Input placeholder="Выберите язык" />
            <ComboBox.Trigger />
          </ComboBox.InputGroup>
          <ComboBox.Popover />
          <ComboBox.Hint>Описание пункта видно только в списке.</ComboBox.Hint>
        </ComboBox>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const CustomListBox: Story = {
  name: "Compound ListBox",
  render: () => (
    <ComboBox options={sampleOptions} defaultValue="ru">
      <ComboBox.Label>Язык интерфейса</ComboBox.Label>
      <ComboBox.InputGroup>
        <ComboBox.Input placeholder="Выберите язык" />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox.Section>
          <ListBox.Header>Доступные языки</ListBox.Header>
          <ListBox.Item value="ru">
            <ListBox.ItemIndicator />
            <ListBox.Label>Русский</ListBox.Label>
            <ListBox.Hint>Кириллица</ListBox.Hint>
          </ListBox.Item>
          <ListBox.Item value="en">
            <ListBox.ItemIndicator />
            <ListBox.Label>English</ListBox.Label>
            <ListBox.Hint>Latin script</ListBox.Hint>
            <ListBox.Icon>
              <IoGlobeOutline aria-hidden />
            </ListBox.Icon>
          </ListBox.Item>
        </ListBox.Section>
      </ComboBox.Popover>
    </ComboBox>
  ),
};

const layoutShowcaseOptions: ComboBoxOption[] = [
  { value: "label-only", label: "Только Label" },
  { value: "label-hint", label: "Label + Hint", hint: "ItemHint → вторая строка в средней колонке" },
  { value: "label-icon", label: "Label + Icon" },
  { value: "indicator-label", label: "Indicator + Label" },
  {
    value: "full-grid",
    label: "Indicator + Label + Hint + Icon",
    hint: "3 cols × 2 rows — все слоты заняты",
    icon: <IoGlobeOutline aria-hidden />,
  },
  { value: "member", label: "Аня Иванова", hint: "@anya · в команде с 2023" },
  { value: "action", label: "Ещё действия" },
];

export const CustomItemParts: Story = {
  name: "Compound — layout слотов",
  render: () => (
    <ComboBox options={layoutShowcaseOptions} defaultValue="full-grid">
      <ComboBox.Label>Layout слотов</ComboBox.Label>
      <ComboBox.InputGroup>
        <ComboBox.Input placeholder="Выберите пункт" />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox selectionIndicator={false}>
          <ListBox.Section>
            <ListBox.Header>Как меняется grid</ListBox.Header>
            <OptionListItemLayoutShowcase
              Item={ListBox.Item}
              ItemLabel={ListBox.Label}
              ItemHint={ListBox.Hint}
              ItemIcon={ListBox.Icon}
              ItemIndicator={ListBox.ItemIndicator}
            />
          </ListBox.Section>
        </ListBox>
      </ComboBox.Popover>
      <ComboBox.Hint>
        Hint и Icon меняют число строк и колонок; rest-children — доп. строка (теги у «member»).
      </ComboBox.Hint>
    </ComboBox>
  ),
};

type ComboBoxStoryProps = ComponentProps<typeof ComboBox>;

function ControlledComboBox(props: ComboBoxStoryProps) {
  const [value, setValue] = useState("ru");
  return (
    <ComboBox
      {...props}
      value={value}
      onValueChange={setValue}
      options={props.options ?? sampleOptions}
    />
  );
}

export const Outline: Story = {
  render: () => (
    <ControlledComboBox variant="outline" label="Язык интерфейса" placeholder="Выберите язык" />
  ),
};

export const Large: Story = {
  render: () => (
    <ControlledComboBox size="mid" label="Размер mid" placeholder="Выберите язык" />
  ),
};

export const Disabled: Story = {
  render: () => (
    <ComboBox
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
    const many: ComboBoxOption[] = Array.from({ length: 40 }, (_, i) => ({
      value: `opt-${i}`,
      label: `Пункт ${i + 1}`,
      hint: i % 5 === 0 ? "С опциональной подсказкой в списке" : undefined,
      icon:
        i % 7 === 0 ? <IoCheckmarkCircle aria-hidden className="text-success" /> : undefined,
    }));
    const [value, setValue] = useState("opt-0");
    return (
      <ComboBox
        label="Много пунктов"
        hint="Прокрутка внутри `<ComboBox.Popover>`."
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
    <ControlledComboBox label="Язык интерфейса" hint="Светлая тема" placeholder="Выберите язык" />
  ),
};

export const Validation: Story = {
  name: "Валидация",
  render: () => (
    <ComboBox status="danger" isRequired options={sampleOptions}>
      <ComboBox.Label>Язык интерфейса</ComboBox.Label>
      <ComboBox.InputGroup>
        <ComboBox.Input placeholder="Выберите язык" />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover />
      <ComboBox.Hint>Язык влияет на интерфейс и письма.</ComboBox.Hint>
      <ComboBox.Error>Выберите язык из списка.</ComboBox.Error>
    </ComboBox>
  ),
};

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex flex-col gap-plus text-left">
      <p className="text-sm text-muted">
        Combobox — <code className="text-accent">aria-expanded</code>,{" "}
        <code className="text-accent">aria-controls</code>,{" "}
        <code className="text-accent">aria-activedescendant</code>. Listbox внутри Popover.
      </p>
      <ComboBox status="danger" isRequired options={sampleOptions}>
        <ComboBox.Label>Язык интерфейса</ComboBox.Label>
        <ComboBox.InputGroup>
          <ComboBox.Input placeholder="Выберите язык" />
          <ComboBox.Trigger />
        </ComboBox.InputGroup>
        <ComboBox.Popover />
        <ComboBox.Hint>Язык влияет на интерфейс и письма.</ComboBox.Hint>
        <ComboBox.Error>Выберите язык из списка.</ComboBox.Error>
      </ComboBox>
    </div>
  ),
};
