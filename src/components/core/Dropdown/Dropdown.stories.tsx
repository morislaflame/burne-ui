import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoChevronForward, IoGlobeOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";

import { Dropdown } from "./Dropdown";

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
  title: "Core Components/Dropdown",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...framedDecorator],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleSelect: Story = {
  name: "Одиночный выбор",
  render() {
    return (
      <Dropdown selectionIndicator defaultValue="ru">
        <Dropdown.Trigger asChild>
          <Button variant="outline">Язык интерфейса</Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Group>
            <Dropdown.Label>Выберите язык</Dropdown.Label>
            <Dropdown.Item value="ru" description="Кириллица, локаль по умолчанию">
              Русский
            </Dropdown.Item>
            <Dropdown.Item value="en" description="Latin script" hint={<IoGlobeOutline aria-hidden />}>
              English
            </Dropdown.Item>
            <Dropdown.Item value="de" disabled description="Скоро">
              Deutsch
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Group>
            <Dropdown.Label>Система</Dropdown.Label>
            <Dropdown.Item value="sys" hint="⌘" selection={false}>
              Настройки
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown>
    );
  },
};

export const MultiSelect: Story = {
  name: "Мультивыбор",
  render() {
    return (
      <Dropdown multiple defaultValue={["a", "c"]}>
        <Dropdown.Trigger asChild>
          <Button variant="ghost">Колонки таблицы</Button>
        </Dropdown.Trigger>
        <Dropdown.Content className="max-w-xs">
          <Dropdown.Group>
            <Dropdown.Label>Видимость</Dropdown.Label>
            <Dropdown.Item value="a" description="Имя и аватар">
              Пользователь
            </Dropdown.Item>
            <Dropdown.Item value="b" description="ISO-код">
              Страна
            </Dropdown.Item>
            <Dropdown.Item value="c">Статус</Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Group>
            <Dropdown.Item
              value="d"
              hint={<IoChevronForward aria-hidden />}
              selection={false}
            >
              Действия
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown>
    );
  },
};

export const GroupsWithDifferentIndicators: Story = {
  name: "Группы: индикатор только в одной",
  render() {
    return (
      <Dropdown defaultValue="a">
        <Dropdown.Trigger asChild>
          <Button variant="outline">Смешанное меню</Button>
        </Dropdown.Trigger>
        <Dropdown.Content className="max-w-xs">
          <Dropdown.Group selectionIndicator>
            <Dropdown.Label>С индикатором</Dropdown.Label>
            <Dropdown.Item value="a">Вариант A</Dropdown.Item>
            <Dropdown.Item value="b">Вариант B</Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Group selectionIndicator={false}>
            <Dropdown.Label>Без индикатора (тот же одиночный выбор)</Dropdown.Label>
            <Dropdown.Item value="c">Вариант C</Dropdown.Item>
            <Dropdown.Item value="d">Вариант D</Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown>
    );
  },
};

export const ItemVariants: Story = {
  name: "Варианты Item (семантика)",
  render() {
    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button variant="outline">Статусные действия</Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Group>
            <Dropdown.Label>Сообщения</Dropdown.Label>
            <Dropdown.Item value="ok" variant="success" selection={false} description="Операция прошла успешно">
              Успех
            </Dropdown.Item>
            <Dropdown.Item value="warn" variant="warning" selection={false} description="Проверьте данные">
              Предупреждение
            </Dropdown.Item>
            <Dropdown.Item value="inf" variant="info" selection={false}>
              Справка
            </Dropdown.Item>
            <Dropdown.Item value="bad" variant="danger" selection={false} description="Без отмены">
              Удалить навсегда
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown>
    );
  },
};

export const WithSubmenu: Story = {
  name: "Вложенное меню (hover)",
  render() {
    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button variant="outline">Меню</Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Group>
            <Dropdown.Label>Действия</Dropdown.Label>
            <Dropdown.Item value="new" selection={false}>
              Новый документ
            </Dropdown.Item>
            <Dropdown.Sub>
              <Dropdown.SubTrigger>Пригласить пользователей</Dropdown.SubTrigger>
              <Dropdown.SubContent>
                <Dropdown.Item value="email" selection={false}>
                  Email
                </Dropdown.Item>
                <Dropdown.Item value="msg" selection={false}>
                  Сообщение
                </Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item value="more" selection={false}>
                  Ещё…
                </Dropdown.Item>
              </Dropdown.SubContent>
            </Dropdown.Sub>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown>
    );
  },
};

export const WithSelectionIndicator: Story = {
  name: "С индикатором выбора",
  render() {
    return (
      <Dropdown selectionIndicator defaultValue="copy">
        <Dropdown.Trigger asChild>
          <Button variant="secondary">Действие</Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Group>
            <Dropdown.Item value="copy">Копировать</Dropdown.Item>
            <Dropdown.Item value="move">Перенести</Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Group>
            <Dropdown.Item value="del" variant="danger" selection={false}>
              Удалить
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown>
    );
  },
};

export const OnLightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightDecorator],
  render() {
    return (
      <Dropdown multiple defaultValue={["x"]}>
        <Dropdown.Trigger asChild>
          <Button variant="outline">Мультивыбор</Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Group>
            <Dropdown.Label>Теги</Dropdown.Label>
            <Dropdown.Item value="x">Alpha</Dropdown.Item>
            <Dropdown.Item value="y">Beta</Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown>
    );
  },
};
