import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IoBookmarkOutline,
  IoCheckmarkCircleOutline,
  IoHeartOutline,
  IoMoonOutline,
  IoNotificationsOutline,
  IoRocketOutline,
} from "react-icons/io5";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/components/core/utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/components/core/utils/dualApiStorySource";

import { Avatar } from "@/components/core/Avatar";
import { Button } from "@/components/core/Button/Button";
import { Card } from "@/components/core/Card";
import { Badge, type BadgeTone, type BadgePlacement } from ".";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3 } from "@/utils/mockImages";

const GREEN_AVATAR_URL = PIN_IMAGE1;
const ORANGE_AVATAR_URL = PIN_IMAGE2;
const BLUE_AVATAR_URL = PIN_IMAGE3;

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

/** Как `Alert.stories` — светлая тема и фон `var(--color-background)`. */
const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
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
    docs: {
      description: {
        component:
          "Компактный статус-бейдж. **Simple** — `icon` + текст в `children`; **inline-иконки** — `data-icon=\"inline-start\" | \"inline-end\"` на child. Для наложения — `Badge.Anchor`.",
      },
    },
  },
  decorators: [...framedDecorator],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "base", "mid", "large"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

function SizesAndVariantsDemo() {
  return (
    <div className="flex flex-col gap-xlarge py-mid">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-base">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            {size}
          </span>
          <div className="flex flex-wrap items-center gap-base">
            {VARIANT_GRID.map((tone) => (
              <Badge key={tone} size={size} color={tone} className="capitalize">
                {tone}
              </Badge>
            ))}
          </div>
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
    <div className="flex flex-col gap-xlarge">
      <p className="max-w-xl text-center text-sm text-muted">
        Наведите на аватар: бейдж слегка увеличивается (scale как у&nbsp;
        <code className="text-accent">Button</code>).
      </p>
      <div className="flex flex-wrap items-start justify-center gap-xlarge">
        <Badge.Anchor>
          <Avatar size="large" label="Jordan Doe" src={GREEN_AVATAR_URL} alt="" loading="lazy" />
          <Badge color="danger" size="small">
            5
          </Badge>
        </Badge.Anchor>

        <Badge.Anchor>
          <Avatar size="large" label="Alex Brown" src={ORANGE_AVATAR_URL} alt="" loading="lazy" />
          <Badge color="secondary" size="small">
            New
          </Badge>
        </Badge.Anchor>

        <Badge.Anchor>
          <Avatar size="large" label="Casey Davis" src={BLUE_AVATAR_URL} alt="" loading="lazy" />
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

export const IconInlineChildren: Story = {
  name: "Inline-иконки (data-icon)",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Compound — data-icon на child">
        <div className="flex flex-wrap gap-small">
          <Badge variant="secondary">
            <IoCheckmarkCircleOutline data-icon="inline-start" />
            Verified
          </Badge>
          <Badge variant="outline">
            Bookmark
            <IoBookmarkOutline data-icon="inline-end" />
          </Badge>
        </div>
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Simple — prop icon + iconPosition">
        <div className="flex flex-wrap gap-small">
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
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const IconStartEnd: Story = {
  name: "Simple: icon + iconPosition",
  render: () => (
    <div className="flex flex-col items-start gap-mid">
      <p className="text-sm text-muted">
        Prop <code className="text-accent">icon</code> +{" "}
        <code className="text-accent">iconPosition</code> — root получает{" "}
        <code className="text-accent">data-icon=&quot;start&quot;</code> /{" "}
        <code className="text-accent">end</code>.
      </p>
      <div className="flex flex-wrap items-center gap-plus">
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
    <div className="flex flex-wrap items-center gap-mid">
      <Badge color="danger" icon={<IoHeartOutline aria-hidden />} aria-label="Избранное" />
      <Badge color="secondary" iconOnly icon={<IoMoonOutline aria-hidden />} aria-label="Secondary" />
      <Badge color="warning" size="small" icon={<IoNotificationsOutline aria-hidden />} aria-label="Уведомления" />
    </div>
  ),
};

function DotsVariantsDemo() {
  return (
    <div className="flex flex-col gap-mid py-mid">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-xlarge">
          {VARIANT_GRID.map((tone) => (
            <div key={tone} className="flex flex-col items-center gap-xsmall">
              <Badge color={tone} dot size={size} aria-label={`${tone}`} />
              <span className="max-w-[4.5rem] text-center text-xs capitalize text-muted">
                {tone}
              </span>
            </div>
          ))}
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
    <div className="flex flex-col gap-mid">
      <p className="max-w-lg text-sm text-muted">
        Внутри якоря бейдж по умолчанию <code>top-right</code>; угол задаётся prop{" "}
        <code>placement</code>.
      </p>
      <div className="grid grid-cols-2 gap-xlarge sm:grid-cols-4">
        {CORNER_LABELS.map(([placement, label]) => (
          <div key={placement} className="flex flex-col items-center gap-base">
            <Badge.Anchor className="box-border h-24 w-24 rounded-2xl border border-dashed border-base bg-surface/40 shadow-none">
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
          <Card.Footer className="flex flex-wrap items-center gap-plus">
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

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex max-w-lg flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Текстовый бейдж читается как подпись; inline-иконки декоративные (
        <code className="text-accent">aria-hidden</code>). Icon-only и dot без подписи требуют{" "}
        <code className="text-accent">aria-label</code>.
      </p>
      <div className="flex flex-wrap items-center gap-plus">
        <Badge variant="success">
          <IoCheckmarkCircleOutline data-icon="inline-start" />
          Опубликовано
        </Badge>
        <Badge
          color="danger"
          icon={<IoHeartOutline aria-hidden />}
          aria-label="Избранное"
        />
        <Badge dot color="info" aria-label="Есть обновления" />
      </div>
    </div>
  ),
};

export const CustomColors: Story = {
  name: "Кастомные бейджи",
  render: () => (
    <div className="flex flex-col gap-xlarge">
      <div className="flex flex-col gap-base">
        <div className="flex flex-wrap items-center gap-plus">
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

      <div className="flex flex-col gap-base">
        <div className="flex flex-wrap items-center gap-xlarge">
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
            <Avatar size="base" label="Demo" />
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
