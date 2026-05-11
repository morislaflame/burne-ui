import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IoCheckmarkCircleOutline,
  IoHeartOutline,
  IoMoonOutline,
  IoNotificationsOutline,
  IoRocketOutline,
} from "react-icons/io5";

import { Avatar } from "@/components/core/Avatar/Avatar";
import { Button } from "@/components/core/Button/Button";
import { Card } from "@/components/core/Card";
import { Badge, type BadgeTone, type BadgePlacement } from "./Badge";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3 } from "@/utils/mockImages";

const GREEN_AVATAR_URL = PIN_IMAGE1;
const ORANGE_AVATAR_URL = PIN_IMAGE2;
const BLUE_AVATAR_URL = PIN_IMAGE3;

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-12 p-10 text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

/** Как `Alert.stories` — светлая тема и фон `var(--color-background)`. */
const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border w-full p-8 text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const VARIANT_GRID: BadgeTone[] = [
  "default",
  "outline",
  "secondary",
  "danger",
  "success",
  "info",
  "warning",
];

const CORNER_LABELS = [
  ["top-right", "top-right"],
  ["top-left", "top-left"],
  ["bottom-right", "bottom-right"],
  ["bottom-left", "bottom-left"],
] satisfies [BadgePlacement, string][];

const meta = {
  title: "Core Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

function SizesAndVariantsDemo() {
  return (
    <div className="flex flex-col gap-6 py-4">
      {(["small", "base", "large"] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          {VARIANT_GRID.map((tone) => (
            <Badge key={tone} size={size} color={tone} className="capitalize">
              {tone}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  );
}

export const SizesAndVariants: Story = {
  name: "Размеры и варианты (тёмная тема)",
  render: () => <SizesAndVariantsDemo />,
};

export const SizesAndVariantsOnLightTheme: Story = {
  name: "Размеры и варианты (светлая тема)",
  decorators: [...lightThemeDecorator],
  render: () => <SizesAndVariantsDemo />,
};

export const BadgeAnchorComposition: Story = {
  name: "Badge.Anchor + Avatar (как в API)",
  render: () => (
    <div className="flex flex-col gap-10">
      <p className="max-w-xl text-center text-sm text-muted">
        Наведите на аватар: бейдж слегка увеличивается (scale как у&nbsp;
        <code className="text-accent">Button</code>).
      </p>
      <div className="flex flex-wrap items-start justify-center gap-14">
        <Badge.Anchor>
          <Avatar size="large" label="Jordan Doe">
            <Avatar.Image src={GREEN_AVATAR_URL} alt="" loading="lazy" />
            <Avatar.Fallback>JD</Avatar.Fallback>
          </Avatar>
          <Badge color="danger" size="small">
            5
          </Badge>
        </Badge.Anchor>

        <Badge.Anchor>
          <Avatar size="large" label="Alex Brown">
            <Avatar.Image src={ORANGE_AVATAR_URL} alt="" loading="lazy" />
            <Avatar.Fallback>AB</Avatar.Fallback>
          </Avatar>
          <Badge color="secondary" size="small">
            New
          </Badge>
        </Badge.Anchor>

        <Badge.Anchor>
          <Avatar size="large" label="Casey Davis">
            <Avatar.Image src={BLUE_AVATAR_URL} alt="" loading="lazy" />
            <Avatar.Fallback>CD</Avatar.Fallback>
          </Avatar>
          <Badge
            color="success"
            dot
            placement="bottom-right"
            size="small"
            aria-label="Активен"
          />
        </Badge.Anchor>
      </div>
    </div>
  ),
};

export const IconStartEnd: Story = {
  name: "data-icon через iconPosition",
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <p className="text-sm text-muted">
        При тексте на корне — <code className="text-accent">data-icon=&quot;start&quot;</code> /
        <code className="text-accent">end</code>.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Badge
          color="info"
          size="base"
          icon={<IoRocketOutline aria-hidden />}
          iconPosition="start"
        >
          Старт
        </Badge>
        <Badge
          color="success"
          size="base"
          icon={<IoRocketOutline aria-hidden />}
          iconPosition="end"
        >
          Конец
        </Badge>
      </div>
    </div>
  ),
};

export const IconOnly: Story = {
  name: "Только иконка",
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge color="danger" icon={<IoHeartOutline aria-hidden />} aria-label="Избранное" />
      <Badge color="secondary" iconOnly icon={<IoMoonOutline aria-hidden />} aria-label="Secondary" />
      <Badge color="warning" size="small" icon={<IoNotificationsOutline aria-hidden />} aria-label="Уведомления" />
    </div>
  ),
};

function DotsVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6 py-4">
      {VARIANT_GRID.map((tone) => (
        <div key={tone} className="flex flex-col items-center gap-1">
          <Badge color={tone} dot size="base" aria-label={`${tone}`} />
          <span className="max-w-[4.5rem] text-center text-xs capitalize text-muted">
            {tone}
          </span>
        </div>
      ))}
    </div>
  );
}

export const DotsVariants: Story = {
  name: "Только кружок (dot, тёмная тема)",
  render: () => <DotsVariantsDemo />,
};

export const DotsVariantsOnLightTheme: Story = {
  name: "Только кружок (dot, светлая тема)",
  decorators: [...lightThemeDecorator],
  render: () => <DotsVariantsDemo />,
};

export const CornersViaAnchorPlacement: Story = {
  name: "Углы через placement у Badge.Anchor",
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="max-w-lg text-sm text-muted">
        Внутри якоря бейдж по умолчанию <code>top-right</code>; угол задаётся prop{" "}
        <code>placement</code>.
      </p>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {CORNER_LABELS.map(([placement, label]) => (
          <div key={placement} className="flex flex-col items-center gap-2">
            <Badge.Anchor className="box-border h-24 w-24 rounded-2xl border border-dashed border-border bg-surface/40 shadow-none">
              <Badge color="danger" size="base" placement={placement}>
                3
              </Badge>
            </Badge.Anchor>
            <span className="text-xs text-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const WithCard: Story = {
  name: "С Card",
  render: () => (
    <div className="flex w-full max-w-md justify-center">
      <Badge.Anchor className="relative w-full max-w-none shrink-0">
        <Card className="w-full overflow-hidden">
          <Card.Content>
            <Card.Title>Релиз 0.12</Card.Title>
            <Card.Description>
              Поддержка Badge, уведомления и счётчиков на интерфейсах продукта.
            </Card.Description>
          </Card.Content>
          <Card.Footer className="flex flex-wrap items-center gap-3">
            <Badge color="success" size="small" icon={<IoCheckmarkCircleOutline aria-hidden />}>
              Готово
            </Badge>
            <Badge color="warning" size="small" iconPosition="end" icon={<IoRocketOutline aria-hidden />}>
              Beta
            </Badge>
            <Button type="button" size="base" variant="outline">
              Детали
            </Button>
          </Card.Footer>
        </Card>
        <Badge color="outline" size="small" aria-label="Новое на карте" dot />
      </Badge.Anchor>
    </div>
  ),
};

export const CustomColors: Story = {
  name: "Кастомные бейджи",
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            color="default"
            size="base"
            className="border-transparent bg-[oklch(58%_0.24_300)] text-white shadow-sm"
          >
            OKLCH фиолетовый
          </Badge>
          <Badge
            color="default"
            size="base"
            className="border-0 bg-[linear-gradient(90deg,#0891b2_0%,#0891b2_12%,#1d4ed8_88%,#1d4ed8_100%)] bg-no-repeat text-white shadow-sm [background-size:100%_100%]"
          >
            Градиент
          </Badge>
          <Badge
            color="default"
            size="base"
            className="border-amber-600/50 bg-amber-400 text-amber-950 shadow-none dark:border-amber-500/40 dark:bg-amber-300 dark:text-amber-950"
          >
            Amber · light/dark
          </Badge>
          <Badge
            color="default"
            size="base"
            icon={<IoRocketOutline aria-hidden />}
            iconPosition="start"
            className="border-transparent bg-rose-600 text-white shadow-none [&_svg]:text-white"
          >
            Иконка + кастом
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-6">
          <Badge
            dot
            size="base"
            color="default"
            aria-label="Кастомная точка violet"
            className="border-0 bg-[oklch(55%_0.2_280)] ring-2 ring-background motion-reduce:ring-1"
          />
          <Badge
            dot
            size="base"
            color="default"
            aria-label="Кастомная точка lime"
            className="border-0 bg-lime-500 ring-2 ring-background motion-reduce:ring-1 dark:bg-lime-400"
          />
          <Badge.Anchor className="rounded-full">
            <Avatar size="base" label="Demo">
              <Avatar.Fallback>D</Avatar.Fallback>
            </Avatar>
            <Badge
              color="default"
              size="small"
              placement="top-right"
              className="border-transparent bg-fuchsia-600 text-white shadow-none"
            >
              9+
            </Badge>
          </Badge.Anchor>
          <span className="text-xs text-muted">
            Якорь + бейдж с произвольными цветами
          </span>
        </div>
      </div>
    </div>
  ),
};
