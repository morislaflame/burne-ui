import type { ComponentProps, ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen } from "storybook/test";
import { IoGlobeOutline } from "react-icons/io5";

import { ListBox } from "@/components/core/ListBox";
import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/components/core/utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/components/core/utils/dualApiStorySource";
import { glossDottedDecorator } from "@/components/core/utils/glossStoryChrome";

import type { SelectOption } from "./selectTypes";
import { Select } from ".";

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

const sampleOptions: SelectOption[] = [
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
    hint: "Подсказка только в списке",
    icon: <IoGlobeOutline aria-hidden />,
  },
];

const meta = {
  title: "Core Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Select без поиска. **Simple** — `options` на root; **Compound** — `<Select.Label>`, `<Select.TriggerGroup>` + `<Select.Value>` / `<Select.Trigger>`, `<Select.Popover>` с `<ListBox>`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    size: { control: "select", options: ["small", "base", "mid", "large"] },
    variant: { control: "select", options: ["default", "outline", "gloss"] },
    status: {
      control: "select",
      options: ["default", "danger", "success", "warning"],
    },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple и Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props на &lt;Select&gt;">
        <Select
          label="Язык интерфейса"
          hint="Без поля поиска — только выбор из списка."
          placeholder="Выберите язык"
          options={sampleOptions}
          defaultValue="ru"
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Select options={sampleOptions} defaultValue="en">
          <Select.Label>Язык интерфейса</Select.Label>
          <Select.TriggerGroup>
            <Select.Value placeholder="Выберите язык" />
            <Select.Trigger />
          </Select.TriggerGroup>
          <Select.Popover />
          <Select.Hint>Описание пункта видно только в списке.</Select.Hint>
        </Select>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const CustomListBox: Story = {
  name: "Compound ListBox",
  render: () => (
    <Select options={sampleOptions} defaultValue="ru">
      <Select.Label>Язык интерфейса</Select.Label>
      <Select.TriggerGroup>
        <Select.Value placeholder="Выберите язык" />
        <Select.Trigger />
      </Select.TriggerGroup>
      <Select.Popover>
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
      </Select.Popover>
    </Select>
  ),
};

type SelectStoryProps = ComponentProps<typeof Select>;

export const Controlled: Story = {
  name: "Controlled",
  render: function ControlledStory() {
    const [value, setValue] = useState("react");
    const options: SelectOption[] = [
      { value: "react", label: "React" },
      { value: "svelte", label: "Svelte" },
      { value: "vue", label: "Vue" },
    ];
    return (
      <Select
        label="Фреймворк"
        options={options}
        value={value}
        onValueChange={setValue}
        hint={`Выбрано: ${value}`}
      />
    );
  },
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex w-full flex-col gap-mid">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <Select
          key={size}
          size={size}
          label={`size="${size}"`}
          options={sampleOptions}
          defaultValue="ru"
        />
      ))}
    </div>
  ),
};

function SelectGlossDemo() {
  return (
    <div className="flex w-full flex-col gap-plus">
      <Select
        variant="gloss"
        label="Язык интерфейса"
        hint='variant="gloss" — стеклянная оболочка поля.'
        placeholder="Выберите язык"
        options={sampleOptions}
        defaultValue="ru"
      />
      <Select variant="gloss" size="small" label="Small" options={sampleOptions} defaultValue="en" />
      <Select variant="gloss" size="mid" label="Mid" options={sampleOptions} defaultValue="de" />
      <Select options={sampleOptions} defaultValue="ru" variant="gloss">
        <Select.Label>Compound gloss</Select.Label>
        <Select.TriggerGroup>
          <Select.Value placeholder="Выберите язык" />
          <Select.Trigger />
        </Select.TriggerGroup>
        <Select.Popover />
        <Select.Hint>Popover тоже в gloss-варианте.</Select.Hint>
      </Select>
      <Select variant="gloss" disabled label="Disabled" options={sampleOptions} defaultValue="en" />
    </div>
  );
}

export const Gloss: Story = {
  name: "Gloss",
  parameters: { controls: { disable: true } },
  decorators: [glossDottedDecorator(false)],
  render: () => <SelectGlossDemo />,
};

export const GlossLight: Story = {
  name: "Gloss — светлая тема",
  parameters: { controls: { disable: true } },
  decorators: [glossDottedDecorator(true)],
  render: () => <SelectGlossDemo />,
};

export const Keyboard: Story = {
  name: "Клавиатура",
  render: () => (
    <Select
      label="Фреймворк"
      options={[
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" },
      ]}
      defaultValue="react"
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox");
    await userEvent.click(trigger);
    await expect(screen.getByRole("listbox")).toBeInTheDocument();
  },
};

export const CustomClassNames: Story = {
  name: "classNames",
  render: () => (
    <Select
      label="Кастомные слоты"
      options={sampleOptions}
      defaultValue="ru"
      classNames={{
        triggerGroup: "ring-1 ring-primary/20",
        value: "text-primary",
        popover: "ring-1 ring-primary/15",
      }}
    />
  ),
};

export const StatusDanger: Story = {
  name: "status danger",
  render: () => (
    <Select
      label="Обязательное поле"
      status="danger"
      error="Выберите значение"
      options={sampleOptions}
      isRequired
    />
  ),
};

export const Playground: Story = {
  name: "Playground",
  args: {
    label: "Язык",
    placeholder: "Выберите язык",
    options: sampleOptions,
    defaultValue: "ru",
    size: "base",
    variant: "default",
    status: "default",
  } satisfies SelectStoryProps,
};
