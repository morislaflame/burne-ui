import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { Expandable } from "@/components/core/Expandable";
import { GlassSurface } from "@/components/core/GlassSurface";
import { Input } from "@/components/core/Input";
import { SearchInput } from "@/components/core/SearchInput";
import { Text } from "@/components/core/Text";

import { RIPPLE_COLOR, Ripple } from "./Ripple";

const RIPPLE_COLOR_KEYS = Object.keys(RIPPLE_COLOR).join(", ");

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto flex w-full max-w-lg flex-col gap-xlarge">
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
      <div className="mx-auto flex w-full max-w-lg flex-col gap-xlarge">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Ripple",
  component: Ripple,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Вставляйте **первым ребёнком** относительно области с \`relative\`: слушатель \`pointerdown\` висит на **родителе** узла Ripple, контент — с \`relative z-[1]\` поверх слоя.

**Именованные цвета** (\`color\`): ${RIPPLE_COLOR_KEYS} — см. объект \`RIPPLE_COLOR\` в экспорте кита. Любая другая строка трактуется как обычный CSS-цвет.

**Button** (\`ripple\`): встроенный риппл выключен по умолчанию, включение — булевый проп. **SearchInput** — то же. **Expandable / Accordion**: положите \`<Ripple />\` среди детей \`<Expandable.Trigger>\` — триггер вынесет его в слой на **весь** \`<button>\` (до краёв, включая область шеврона).

Проп **\`direction\`**: \`in\` — к точке нажатия сходится (по умолчанию), \`out\` — расширяется от точки.

Длительность — **\`duration\`** (мс). Стартовая непрозрачность точки — только через motion-токены.`,
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    color: {
      control: "select",
      options: Object.keys(RIPPLE_COLOR),
      description: `Ключ из RIPPLE_COLOR или произвольная строка цвета`,
    },
    disabled: { control: "boolean" },
    duration: { control: "number" },
    direction: {
      control: "select",
      options: ["in", "out"],
      description: "in — схлопывание к точке, out — расход от точки",
    },
  },
} satisfies Meta<typeof Ripple>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "Песочница",
  args: {
    disabled: false,
    color: "accentSoft",
    direction: "in",
  },
  render: (args) => (
    <div
      className="relative cursor-pointer overflow-hidden rounded-mid border border-base bg-surface shadow-token-sm"
      role="presentation"
    >
      <Ripple {...args} className="rounded-[inherit]" />
      <div className="relative z-[1] flex min-h-[7rem] flex-col justify-center gap-small px-plus py-plus">
        <Text variant="mid" className="font-medium">
          Область с Ripple
        </Text>
        <Text variant="base" className="text-muted">
          Нажмите в любом месте — волна сойдётся к точке.
        </Text>
      </div>
    </div>
  ),
};

export const WithCardManual: Story = {
  name: "С Card",
  render: () => (
    <Card
      variant="outline"
      className="relative cursor-pointer"
      onClick={() => {}}
    >
      <Ripple color="accentSoft" />
      <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
        <Card.Content>
          <Card.Title>Вариант без pressable</Card.Title>
          <Card.Description>
            Первым ребёнком — Ripple, текст в слое <code className="text-xs">z-[1]</code>.
          </Card.Description>
        </Card.Content>
      </div>
    </Card>
  ),
};

export const WithButton: Story = {
  name: "С Button",
  render: () => (
    <div className="flex flex-col gap-small">
      <Text variant="base" className="text-muted">
        В приложении включаете <code className="text-xs">ripple</code>
      </Text>
      <div className="flex flex-wrap gap-small">
        <Button variant="default" ripple>
          По умолчанию
        </Button>
        <Button variant="ghost" ripple={false}>
          Без риппла
        </Button>
      </div>
    </div>
  ),
};

export const DirectionCompare: Story = {
  name: "Направление in / out",
  render: () => (
    <div className="flex flex-wrap gap-mid">
      <div
        className="relative min-h-[6rem] min-w-[10rem] cursor-pointer overflow-hidden rounded-mid border border-base bg-surface"
        role="presentation"
      >
        <Ripple color="accentSoft" direction="in" />
        <div className="relative z-[1] flex h-full items-center justify-center px-plus">
          <Text variant="small">direction=&quot;in&quot;</Text>
        </div>
      </div>
      <div
        className="relative min-h-[6rem] min-w-[10rem] cursor-pointer overflow-hidden rounded-mid border border-base bg-surface"
        role="presentation"
      >
        <Ripple color="accentSoft" direction="out" />
        <div className="relative z-[1] flex h-full items-center justify-center px-plus">
          <Text variant="small">direction=&quot;out&quot;</Text>
        </div>
      </div>
    </div>
  ),
};

export const WithExpandable: Story = {
  name: "С Expandable",
  render: () => (
    <Expandable defaultOpen>
      <Expandable.Trigger>
        <Ripple color="accentMuted" />
        <Expandable.Content>
          <Expandable.Title>Риппл на весь триггер</Expandable.Title>
          <Expandable.Description className="text-muted">
            Напишите <code className="text-xs">&lt;Ripple /&gt;</code> рядом с контентом — триггер примонтирует слой на всю ширину кнопки и под шеврон.
          </Expandable.Description>
        </Expandable.Content>
      </Expandable.Trigger>
      <Expandable.Panel>
        <Text variant="base" className="leading-relaxed">
          Нажмите у края строки или у шеврона — эффект на всей кнопке.
        </Text>
      </Expandable.Panel>
    </Expandable>
  ),
};

export const WithSearchInput: Story = {
  name: "С SearchInput",
  render: () => (
    <div className="flex flex-col gap-small">
      <Text variant="base" className="text-muted">
        <code className="text-xs">ripple</code> — булевый проп
      </Text>
      <SearchInput placeholder="Найти…" ripple />
    </div>
  ),
};

export const WithAlert: Story = {
  name: "С Alert",
  render: () => (
    <Alert
      status="info"
      className="relative max-w-md cursor-pointer overflow-hidden"
    >
      <Ripple color="info" />
      <Alert.Message className="relative z-[1]">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Уведомление с Ripple</Alert.Title>
          <Alert.Description>Скругление через наследование у родителя.</Alert.Description>
        </Alert.Content>
      </Alert.Message>
    </Alert>
  ),
};

export const WithGlassSurface: Story = {
  name: "С GlassSurface",
  render: () => (
    <div className="flex flex-col gap-small">
      <Text variant="base" className="text-muted">
        Внешняя обёртка <code className="text-xs">relative overflow-hidden rounded-base</code>
      </Text>
      <div className="relative overflow-hidden rounded-base">
        <Ripple color="accentSoft" className="rounded-[inherit]" />
        <div className="relative z-[1]">
          <GlassSurface contentClassName="p-plus">
            <Text variant="base">
              Стеклянная панель — нажмите по тексту или по стеклу.
            </Text>
          </GlassSurface>
        </div>
      </div>
    </div>
  ),
};

export const WithInputShell: Story = {
  name: "С Input (оболочка)",
  render: () => (
    <div className="flex flex-col gap-small">
      <Text variant="base" className="text-muted">
        Общая интерактивная карточка вокруг поля
      </Text>
      <div className="relative overflow-hidden rounded-base border border-base bg-surface p-mid shadow-token-sm">
        <Ripple color="accentSoft" />
        <div className="relative z-[1] flex flex-col gap-small">
          <Text variant="small" className="font-medium text-muted">
            Контакт
          </Text>
          <Input placeholder="you@example.com" />
        </div>
      </div>
    </div>
  ),
};

export const ArbitraryCssColor: Story = {
  name: "Произвольный CSS-цвет",
  render: () => (
    <div
      className="relative max-w-xs cursor-pointer overflow-hidden rounded-mid border border-base bg-surface p-plus"
      role="presentation"
    >
      <Ripple color="oklch(0.72 0.14 250 / 0.35)" duration={550} />
      <div className="relative z-[1]">
        <Text variant="base">Проп color — любая строка, не только пресеты.</Text>
      </div>
    </div>
  ),
};

export const OnLightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div
      className="relative cursor-pointer overflow-hidden rounded-mid border border-base bg-surface"
      role="presentation"
    >
      <Ripple color="accentSoft" />
      <div className="relative z-[1] flex min-h-[6rem] items-center justify-center px-plus">
        <Text variant="base">Ripple на светлом фоне</Text>
      </div>
    </div>
  ),
};
