import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoCheckmarkCircle, IoGlobeOutline } from "react-icons/io5";

import { OptionListItemLayoutShowcase } from "@/components/core/utils/optionListItemStoryLayouts";

import { ListBox } from "./ListBox";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[16rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="w-full max-w-sm">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/ListBox",
  component: ListBox,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Список выбора (`role=\"listbox\"`) без собственного фона — оболочка (Popover, Card) задаётся снаружи. Compound: `<ListBox.Item>` с `<ListBox.Label>`, `<ListBox.Hint>`, `<ListBox.Icon>`, `<ListBox.ItemIndicator />`; секции — `<ListBox.Section>` + `<ListBox.Header>`.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof ListBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "Базовый",
  render: () => (
    <ListBox defaultValue="ru">
      <ListBox.Item value="ru" label="Русский" hint="Интерфейс на русском" />
      <ListBox.Item value="en" label="English" hint="UI in English" />
      <ListBox.Item value="de" label="Deutsch" disabled hint="Скоро" />
    </ListBox>
  ),
};

export const Compound: Story = {
  name: "Compound",
  render: () => (
    <ListBox defaultValue="en">
      <ListBox.Section>
        <ListBox.Header>Языки</ListBox.Header>
        <ListBox.Item value="ru">
          <ListBox.ItemIndicator />
          <ListBox.Label>Русский</ListBox.Label>
          <ListBox.Hint>Кириллица, локаль по умолчанию</ListBox.Hint>
          <ListBox.Icon>
            <IoGlobeOutline aria-hidden />
          </ListBox.Icon>
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
      <ListBox.Separator />
      <ListBox.Section>
        <ListBox.Header>Дополнительно</ListBox.Header>
        <ListBox.Item value="sys">
          <ListBox.Label>Системный</ListBox.Label>
          <ListBox.Hint>Следовать настройкам ОС</ListBox.Hint>
        </ListBox.Item>
      </ListBox.Section>
    </ListBox>
  ),
};

export const Multiple: Story = {
  name: "Мультивыбор",
  render: function MultipleList() {
    const [value, setValue] = useState<string[]>(["a", "c"]);
    return (
      <ListBox multiple value={value} onValueChange={(v) => setValue(v as string[])}>
        <ListBox.Item value="a" label="Пользователь" hint="Имя и аватар" />
        <ListBox.Item value="b" label="Страна" hint="ISO-код" />
        <ListBox.Item value="c" label="Статус" />
      </ListBox>
    );
  },
};

export const Empty: Story = {
  name: "Пустой список",
  render: () => <ListBox.Empty />,
};

export const CustomEmpty: Story = {
  name: "Кастомное empty-состояние",
  render: () => (
    <ListBox>
      <ListBox.Empty>Ничего не найдено по запросу</ListBox.Empty>
    </ListBox>
  ),
};

export const WithIcons: Story = {
  name: "С иконками",
  render: () => (
    <ListBox defaultValue="ok">
      <ListBox.Item value="ok">
        <ListBox.Label>Успех</ListBox.Label>
        <ListBox.Icon>
          <IoCheckmarkCircle aria-hidden className="text-success" />
        </ListBox.Icon>
      </ListBox.Item>
      <ListBox.Item value="globe">
        <ListBox.Label>Global</ListBox.Label>
        <ListBox.Icon>
          <IoGlobeOutline aria-hidden />
        </ListBox.Icon>
      </ListBox.Item>
    </ListBox>
  ),
};

export const CustomItemParts: Story = {
  name: "Compound — layout слотов",
  render: () => (
    <ListBox selectionIndicator={false} defaultValue="full-grid">
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
  ),
};
