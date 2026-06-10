import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IoChevronForward,
  IoGlobeOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoSettingsOutline,
} from "react-icons/io5";

import { Avatar } from "@/components/core/Avatar";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { OptionListItemLayoutShowcase } from "@/components/core/utils/optionListItemStoryLayouts";
import { PIN_IMAGE2 } from "@/utils/mockImages";

import { Dropdown } from ".";

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
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Составной API: `Dropdown.Trigger`, `Dropdown.Popover`, `Dropdown.Item` с `<Dropdown.ItemIndicator />`, `<Dropdown.ItemLabel>`, `<Dropdown.ItemHint>`, `<Dropdown.ItemIcon>`. Layout пункта — grid как у Radio/Checkbox: индикатор | label+hint | icon. Панель — через `Popover`.",
      },
    },
  },
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
        <Dropdown.Popover>
          <Dropdown.Group>
            <Dropdown.Label>Выберите язык</Dropdown.Label>
            <Dropdown.Item value="ru">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Русский</Dropdown.ItemLabel>
              <Dropdown.ItemHint>Кириллица, локаль по умолчанию</Dropdown.ItemHint>
            </Dropdown.Item>
            <Dropdown.Item value="en">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
              <Dropdown.ItemHint>Latin script</Dropdown.ItemHint>
              <Dropdown.ItemIcon>
                <IoGlobeOutline aria-hidden />
              </Dropdown.ItemIcon>
            </Dropdown.Item>
            <Dropdown.Item value="de" disabled>
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Deutsch</Dropdown.ItemLabel>
              <Dropdown.ItemHint>Скоро</Dropdown.ItemHint>
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Group>
            <Dropdown.Label>Система</Dropdown.Label>
            <Dropdown.Item value="sys" selection={false}>
              <Dropdown.ItemLabel>Настройки</Dropdown.ItemLabel>
              <Dropdown.ItemIcon>⌘</Dropdown.ItemIcon>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
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
        <Dropdown.Popover className="max-w-xs">
          <Dropdown.Group>
            <Dropdown.Label>Видимость</Dropdown.Label>
            <Dropdown.Item value="a">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Пользователь</Dropdown.ItemLabel>
              <Dropdown.ItemHint>Имя и аватар</Dropdown.ItemHint>
            </Dropdown.Item>
            <Dropdown.Item value="b">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Страна</Dropdown.ItemLabel>
              <Dropdown.ItemHint>ISO-код</Dropdown.ItemHint>
            </Dropdown.Item>
            <Dropdown.Item value="c">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Статус</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Group>
            <Dropdown.Item value="d" selection={false}>
              <Dropdown.ItemLabel>Действия</Dropdown.ItemLabel>
              <Dropdown.ItemIcon>
                <IoChevronForward aria-hidden />
              </Dropdown.ItemIcon>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
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
        <Dropdown.Popover className="max-w-xs">
          <Dropdown.Group selectionIndicator>
            <Dropdown.Label>С индикатором</Dropdown.Label>
            <Dropdown.Item value="a">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Вариант A</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="b">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Вариант B</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Group selectionIndicator={false}>
            <Dropdown.Label>Без индикатора (тот же одиночный выбор)</Dropdown.Label>
            <Dropdown.Item value="c">
              <Dropdown.ItemLabel>Вариант C</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="d">
              <Dropdown.ItemLabel>Вариант D</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
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
        <Dropdown.Popover>
          <Dropdown.Group>
            <Dropdown.Label>Сообщения</Dropdown.Label>
            <Dropdown.Item value="ok" variant="success" selection={false}>
              <Dropdown.ItemLabel>Успех</Dropdown.ItemLabel>
              <Dropdown.ItemHint>Операция прошла успешно</Dropdown.ItemHint>
            </Dropdown.Item>
            <Dropdown.Item value="warn" variant="warning" selection={false}>
              <Dropdown.ItemLabel>Предупреждение</Dropdown.ItemLabel>
              <Dropdown.ItemHint>Проверьте данные</Dropdown.ItemHint>
            </Dropdown.Item>
            <Dropdown.Item value="inf" variant="info" selection={false}>
              <Dropdown.ItemLabel>Справка</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="bad" variant="danger" selection={false}>
              <Dropdown.ItemLabel>Удалить навсегда</Dropdown.ItemLabel>
              <Dropdown.ItemHint>Без отмены</Dropdown.ItemHint>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
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
        <Dropdown.Popover>
          <Dropdown.Group>
            <Dropdown.Label>Действия</Dropdown.Label>
            <Dropdown.Item value="new" selection={false}>
              <Dropdown.ItemLabel>Новый документ</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Sub>
              <Dropdown.SubTrigger>Пригласить пользователей</Dropdown.SubTrigger>
              <Dropdown.SubContent>
                <Dropdown.Item value="email" selection={false}>
                  <Dropdown.ItemLabel>Email</Dropdown.ItemLabel>
                </Dropdown.Item>
                <Dropdown.Item value="msg" selection={false}>
                  <Dropdown.ItemLabel>Сообщение</Dropdown.ItemLabel>
                </Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item value="more" selection={false}>
                  <Dropdown.ItemLabel>Ещё…</Dropdown.ItemLabel>
                </Dropdown.Item>
              </Dropdown.SubContent>
            </Dropdown.Sub>
          </Dropdown.Group>
        </Dropdown.Popover>
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
        <Dropdown.Popover>
          <Dropdown.Group>
            <Dropdown.Item value="copy">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Копировать</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="move">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Перенести</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Group>
            <Dropdown.Item value="del" variant="danger" selection={false}>
              <Dropdown.ItemLabel>Удалить</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const CustomItemIndicator: Story = {
  name: "ItemIndicator (compound)",
  render() {
    return (
      <Dropdown multiple defaultValue={["ru"]}>
        <Dropdown.Trigger asChild>
          <Button variant="outline">Языки</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Group>
            <Dropdown.Label>С variant secondary</Dropdown.Label>
            <Dropdown.Item value="ru">
              <Dropdown.ItemIndicator variant="secondary" />
              <Dropdown.ItemLabel>Русский</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="en">
              <Dropdown.ItemIndicator variant="outline" />
              <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const CustomItemParts: Story = {
  name: "Compound — layout слотов",
  render() {
    return (
      <Dropdown selectionIndicator={false} defaultValue="full-grid">
        <Dropdown.Trigger asChild>
          <Button variant="outline">Layout слотов</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover className="max-w-md">
          <Dropdown.Group>
            <Dropdown.Label>Как меняется grid</Dropdown.Label>
            <OptionListItemLayoutShowcase
              Item={Dropdown.Item}
              ItemLabel={Dropdown.ItemLabel}
              ItemHint={Dropdown.ItemHint}
              ItemIcon={Dropdown.ItemIcon}
              ItemIndicator={Dropdown.ItemIndicator}
            />
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const CustomAvatarTrigger: Story = {
  name: "Кастомный триггер (Avatar)",
  render() {
    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <button
            type="button"
            className="rounded-full outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Меню пользователя Jane Doe"
          >
            <Avatar size="base" label="Jane Doe">
              <Avatar.Image src={PIN_IMAGE2} alt="" loading="lazy" />
              <Avatar.Fallback>JD</Avatar.Fallback>
            </Avatar>
          </button>
        </Dropdown.Trigger>
        <Dropdown.Popover className="min-w-[14rem]">
          <div role="presentation" className="pb-plus">
            <div className="flex items-center gap-small">
              <Avatar size="small" label="Jane Doe">
                <Avatar.Image src={PIN_IMAGE2} alt="" loading="lazy" />
                <Avatar.Fallback>JD</Avatar.Fallback>
              </Avatar>
              <div className="flex min-w-0 flex-col gap-px">
                <Text as="p" variant="base" className="font-medium leading-tight">
                  Jane Doe
                </Text>
                <Text as="p" variant="tools" className="text-muted leading-tight">
                  jane@example.com
                </Text>
              </div>
            </div>
          </div>
          <Dropdown.Separator />
          <Dropdown.Group>
            <Dropdown.Item value="dashboard" selection={false}>
              <Dropdown.ItemLabel>Dashboard</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="profile" selection={false}>
              <Dropdown.ItemLabel>Profile</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="settings" selection={false}>
              <Dropdown.ItemLabel>Settings</Dropdown.ItemLabel>
              <Dropdown.ItemIcon>
                <IoSettingsOutline aria-hidden className="opacity-70" />
              </Dropdown.ItemIcon>
            </Dropdown.Item>
            <Dropdown.Item value="team" selection={false}>
              <Dropdown.ItemLabel>Create Team</Dropdown.ItemLabel>
              <Dropdown.ItemIcon>
                <IoPeopleOutline aria-hidden className="opacity-70" />
              </Dropdown.ItemIcon>
            </Dropdown.Item>
            <Dropdown.Item value="logout" variant="danger" selection={false}>
              <Dropdown.ItemLabel>Log Out</Dropdown.ItemLabel>
              <Dropdown.ItemIcon>
                <IoLogOutOutline aria-hidden />
              </Dropdown.ItemIcon>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
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
        <Dropdown.Popover>
          <Dropdown.Group>
            <Dropdown.Label>Теги</Dropdown.Label>
            <Dropdown.Item value="x">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Alpha</Dropdown.ItemLabel>
            </Dropdown.Item>
            <Dropdown.Item value="y">
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>Beta</Dropdown.ItemLabel>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const LinkItems: Story = {
  name: "Link-пункты (href)",
  render() {
    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button variant="outline">Навигация</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover aria-label="Разделы">
          <Dropdown.Item href="/catalog" selection={false}>
            <Dropdown.ItemLabel>Каталог</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item href="/docs" selection={false}>
            <Dropdown.ItemLabel>Документация</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item value="settings" selection={false}>
            <Dropdown.ItemLabel>Настройки (кнопка)</Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
};

export const Accessibility: Story = {
  name: "Доступность",
  render() {
    return (
      <div className="flex max-w-md flex-col gap-mid text-left">
        <p className="text-sm text-muted">
          Триггер: <code className="text-primary">aria-expanded</code>,{" "}
          <code className="text-primary">aria-controls</code>. Меню: стрелки, Home/End, Escape
          возвращает фокус на триггер. Группа с <code className="text-primary">Dropdown.Label</code>{" "}
          — <code className="text-primary">aria-labelledby</code>.
        </p>
        <Dropdown selectionIndicator defaultValue="ru">
          <Dropdown.Trigger asChild>
            <Button variant="secondary">Язык</Button>
          </Dropdown.Trigger>
          <Dropdown.Popover>
            <Dropdown.Group>
              <Dropdown.Label>Выберите язык</Dropdown.Label>
              <Dropdown.Item value="ru">
                <Dropdown.ItemIndicator />
                <Dropdown.ItemLabel>Русский</Dropdown.ItemLabel>
              </Dropdown.Item>
              <Dropdown.Item value="en">
                <Dropdown.ItemIndicator />
                <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
              </Dropdown.Item>
            </Dropdown.Group>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    );
  },
};
