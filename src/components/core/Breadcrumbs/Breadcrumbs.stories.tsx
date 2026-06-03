import type { ComponentType, MouseEvent } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Breadcrumbs } from "./Breadcrumbs";

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

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border flex h-full min-h-[14rem] w-full flex-col items-center justify-center p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const preventNav = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
  e.preventDefault();
};

const meta = {
  title: "Core Components/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Навигационная цепочка. Compound: `Breadcrumbs.List` + `Breadcrumbs.Item`. При `collapse` кнопка «…» открывает `Dropdown` со скрытыми разделами (`Dropdown.Item` с `href`).",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Главная
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Каталог
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Текущая страница</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  ),
};

export const Collapsed: Story = {
  name: "Сжатие + меню «…»",
  render: () => (
    <div className="flex flex-col items-center gap-mid">
      <p className="max-w-md text-center text-sm text-muted">
        При более чем трёх пунктах: первый · … · два последних. Нажмите «…» — список скрытых
        разделов.
      </p>
      <Breadcrumbs>
        <Breadcrumbs.List>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Главная
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Раздел
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Подраздел
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Категория
          </Breadcrumbs.Item>
          <Breadcrumbs.Item current>Страница</Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs>
    </div>
  ),
};

export const Expanded: Story = {
  name: "Без сжатия",
  render: () => (
    <Breadcrumbs collapse={false}>
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Главная
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Раздел
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Подраздел
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Категория
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Страница</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  ),
};

export const TwoItems: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Каталог
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Товар</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  ),
};

export const SingleCurrent: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.List>
        <Breadcrumbs.Item current>Только текущая</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  ),
};

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex max-w-lg flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        <code className="text-accent">&lt;nav aria-label&gt;</code>, текущая страница —{" "}
        <code className="text-accent">aria-current=&quot;page&quot;</code> на последнем пункте,
        меню «…» — <code className="text-accent">aria-expanded</code> /{" "}
        <code className="text-accent">role=&quot;menu&quot;</code>, Escape закрывает.
      </p>
      <Breadcrumbs aria-label="Путь к странице">
        <Breadcrumbs.List>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Главная
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Каталог
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Электроника
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Ноутбуки
          </Breadcrumbs.Item>
          <Breadcrumbs.Item current>MacBook Pro</Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs>
    </div>
  ),
};

export const LightTheme: Story = {
  decorators: [...lightThemeDecorator],
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Главная
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Раздел
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Подраздел
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Категория
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Страница</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  ),
};
