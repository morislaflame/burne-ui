import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "@/components/core/Card/Card";

import { SearchInput } from "./SearchInput";

const darkThemeDecorator = [
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
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Atomic-поиск с раскрытием. Для форм — `Input`. **a11y:** задавайте `aria-label`; свёрнутый триггер — `role=\"button\"`, развёрнутое поле — `role=\"search\"` на оболочке.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  args: {
    placeholder: "Найти…",
    size: "base" as const,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["small", "base", "mid", "large"],
    },
    ripple: {
      control: "boolean",
      description: "Встроенный `<Ripple color=\"accentSoft\" />` на корне оболочки.",
    },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRipple: Story = {
  name: "С рипплом",
  args: {
    ripple: true,
  },
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-xlarge">
      <SearchInput size="small" placeholder="Поиск" />
      <SearchInput size="base" placeholder="Поиск" />
      <SearchInput size="mid" placeholder="Поиск" />
      <SearchInput size="large" placeholder="Поиск" />
    </div>
  ),
};

export const OnLight: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
};

export const Controlled: Story = {
  name: "Контроль expanded",
  render: function Controlled() {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-mid">
        <SearchInput
          expanded={open}
          onExpandedChange={setOpen}
          placeholder="Контролируемое поле"
          aria-label="Контролируемый поиск"
        />
        <button
          type="button"
          className="text-sm text-muted underline"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Свернуть" : "Развернуть"} снаружи
        </button>
      </div>
    );
  },
};

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Свёрнуто — <code className="text-accent">role=&quot;button&quot;</code>,{" "}
        <code className="text-accent">aria-expanded</code>, Enter/Space открывает. Развёрнуто —{" "}
        <code className="text-accent">role=&quot;search&quot;</code>, фокус на{" "}
        <code className="text-accent">input</code>. Задайте{" "}
        <code className="text-accent">aria-label</code> вместо одного placeholder. Clear —{" "}
        <code className="text-accent">aria-label=&quot;Очистить поле&quot;</code>.
      </p>
      <SearchInput aria-label="Поиск по документации" placeholder="Найти…" />
    </div>
  ),
};

const DEMO_EVENTS = [
  {
    id: "1",
    title: "Релиз библиотеки",
    subtitle: "Публикация npm и Storybook",
  },
  {
    id: "2",
    title: "Токены темы",
    subtitle: "Светлая и тёмная схема CSS-переменных",
  },
  {
    id: "3",
    title: "Диалоги и модалки",
    subtitle: "Компонент Dialog и AlertDialog",
  },
  {
    id: "4",
    title: "Формы",
    subtitle: "Input, кнопки и валидация",
  },
  {
    id: "5",
    title: "Поиск в интерфейсе",
    subtitle: "SearchInput и фильтрация списков",
  },
  {
    id: "6",
    title: "Анимации",
    subtitle: "anime.js и hover-lift на карточках",
  },
  {
    id: "7",
    title: "GlassSurface",
    subtitle: "Стеклянные панели и шейдеры",
  },
  {
    id: "8",
    title: "Accordion",
    subtitle: "Составной раскрывающийся список",
  },
];

function matchesQuery(
  q: string,
  title: string,
  subtitle: string,
): boolean {
  const n = q.trim().toLowerCase();
  if (!n) return true;
  return (
    title.toLowerCase().includes(n) || subtitle.toLowerCase().includes(n)
  );
}

export const FilterList: Story = {
  name: "Поиск по списку карточек",
  render: function FilterDemo() {
    const [query, setQuery] = useState("");

    const filtered = useMemo(
      () =>
        DEMO_EVENTS.filter((item) =>
          matchesQuery(query, item.title, item.subtitle),
        ),
      [query],
    );

    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-mid">
        <div className="flex w-full justify-end">
          <SearchInput
            placeholder="Заголовок или описание…"
            expandedWidth={400}
            collapseOnBlur={false}
            value={query}
            onValueChange={setQuery}
            aria-label="Фильтр списка карточек"
          />
        </div>
        <p className="text-center text-xs text-muted">
          Найдено: {filtered.length} из {DEMO_EVENTS.length}
        </p>
        <ul className="flex list-none flex-col gap-plus p-0">
          {filtered.length === 0 ? (
            <li className="rounded-mid border border-dashed border-base px-mid py-xlarge text-center text-sm text-muted">
              Ничего не подошло под «{query.trim() || "…"}». Попробуйте другой
              запрос.
            </li>
          ) : (
            filtered.map((item) => (
              <li key={item.id}>
                <Card>
                  <Card.Content>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Description>{item.subtitle}</Card.Description>
                  </Card.Content>
                </Card>
              </li>
            ))
          )}
        </ul>
      </div>
    );
  },
};
