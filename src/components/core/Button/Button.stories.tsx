import type { ComponentType } from "react";
import { useCallback, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { IoAdd } from "react-icons/io5";

import {
  Button,
  type ButtonAsyncState,
  type ButtonStatus,
  type ButtonVariant,
} from "./Button";

const BUTTON_VARIANTS: ButtonVariant[] = [
  "default",
  "primary",
  "outline",
  "secondary",
  "ghost",
  "gloss",
];

const BUTTON_STATUSES: ButtonStatus[] = [
  "default",
  "danger",
  "success",
  "info",
  "warning",
];

/** Тёмная тема — токены из `:root`, явный фон под сторисы. */
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
  title: "Core Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...darkThemeDecorator],
  args: {
    children: "Кнопка",
    variant: "default",
    status: "default",
    size: "base",
    animated: true,
    disabled: false,
    iconOnly: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "primary",
        "outline",
        "secondary",
        "ghost",
        "gloss",
      ],
    },
    status: {
      control: "select",
      options: ["default", "danger", "success", "info", "warning"] satisfies ButtonStatus[],
    },
    size: {
      control: "select",
      options: ["small", "base", "mid", "large"],
    },
    animated: { control: "boolean" },
    iconOnly: {
      control: "boolean",
      description: "Только иконка: `min-w-fit` вместо `min-w-button-*`. Задайте `aria-label`.",
    },
    ripple: {
      control: "boolean",
      description:
        "Встроенный `<Ripple />` с тоном под variant. По умолчанию в сторибуке включён для демо.",
    },
  },
  render: (args) => <Button {...args} />,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ClickInteraction: Story = {
  name: "Interaction: клик",
  args: {
    children: "Кнопка",
    onClick: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Кнопка" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Sizes: Story = {
  name: "Размеры (small — large)",
  render: () => (
    <div className="flex items-start gap-plus">
      <Button size="small">
        Small
      </Button>
      <Button size="base">
        Base
      </Button>
      <Button size="mid">
        Mid
      </Button>
      <Button size="large">
        Large
      </Button>
    </div>
  ),
};

export const IconOnlySizes: Story = {
  name: "Только иконка (iconOnly)",
  render: () => (
    <div className="flex flex-wrap items-center gap-plus">
      <Button size="small" variant="outline" iconOnly aria-label="Добавить">
        <IoAdd aria-hidden className="icon-small" />
      </Button>
      <Button size="base" variant="outline" iconOnly aria-label="Добавить">
        <IoAdd aria-hidden className="icon-base" />
      </Button>
      <Button size="mid" variant="outline" iconOnly aria-label="Добавить">
        <IoAdd aria-hidden className="icon-large" />
      </Button>
      <Button size="large" variant="outline" iconOnly aria-label="Добавить">
        <IoAdd aria-hidden className="icon-large" />
      </Button>
    </div>
  ),
};

export const Variants: Story = {
  name: "Варианты",
  render: () => (
    <div className="flex flex-wrap items-start gap-plus">
      <Button>
        Default
      </Button>
      <Button variant="primary">
        Primary
      </Button>
      <Button variant="outline">
        Outline
      </Button>
      <Button variant="secondary">
        Secondary
      </Button>
      <Button variant="ghost" ripple>
        Ghost
      </Button>
    </div>
  ),
};

export const VariantsOnLightTheme: Story = {
  name: "Варианты — светлая тема",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex flex-wrap items-start gap-plus">
      <Button>
        Default
      </Button>
      <Button variant="primary">
        Primary
      </Button>
      <Button variant="outline">
        Outline
      </Button>
      <Button variant="secondary">
        Secondary
      </Button>
      <Button variant="ghost" ripple>
        Ghost
      </Button>
    </div>
  ),
};

function StatusVariantsDemo() {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-xlarge py-mid">
      {BUTTON_STATUSES.map((status) => (
        <div key={status} className="flex flex-col gap-base">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            status: {status}
          </span>
          <div className="flex flex-wrap items-center gap-base">
            {BUTTON_VARIANTS.map((variant) => (
              <Button
                key={`${status}-${variant}`}
                variant={variant}
                status={status}
                className="min-w-[7.5rem] capitalize"
              >
                {variant}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const StatusVariants: Story = {
  name: "Статусы × варианты (тёмная тема)",
  render: () => <StatusVariantsDemo />,
};

export const StatusVariantsOnLightTheme: Story = {
  name: "Статусы × варианты (светлая тема)",
  decorators: [...lightThemeDecorator],
  render: () => <StatusVariantsDemo />,
};

export const WithLeftIcon: Story = {
  name: "С иконкой слева",
  render: () => (
    <div className="flex flex-wrap items-center gap-plus">
      <Button size="small" leftIcon={<IoAdd aria-hidden />}>
        Добавить
      </Button>
      <Button size="base" variant="outline" leftIcon={<IoAdd aria-hidden />}>
        Создать
      </Button>
      <Button size="large" variant="ghost" leftIcon={<IoAdd aria-hidden />}>
        Ещё
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithoutAnimation: Story = {
  args: { animated: false },
};

export const WithoutRipple: Story = {
  name: "С рипплом",
  args: { ripple: true },
};

export const OnLightTheme: Story = {
  name: "Светлая тема (data-theme)",
  decorators: [...lightThemeDecorator],
};

export const AsyncSuccess: Story = {
  name: "Async → успех",
  args: {
    children: "Сохранить",
    ripple: true,
    onAsyncClick: () =>
      new Promise<boolean>((resolve) => {
        window.setTimeout(() => resolve(true), 1400);
      }),
  },
};

export const AsyncError: Story = {
  name: "Async → ошибка",
  args: {
    children: "Отправить",
    ripple: true,
    onAsyncClick: () =>
      new Promise<boolean>((resolve) => {
        window.setTimeout(() => resolve(false), 1400);
      }),
  },
};

function ControlledAsyncDemo() {
  const [state, setState] = useState<ButtonAsyncState>("idle");

  const run = useCallback(() => {
    if (state !== "idle") return;
    setState("loading");
    window.setTimeout(() => {
      setState(Math.random() > 0.5 ? "success" : "error");
    }, 1200);
  }, [state]);

  return (
    <div className="flex flex-col items-center gap-plus">
      <Button asyncState={state} onClick={run} disabled={state !== "idle"} ripple>
        Контролируемая
      </Button>
      <button
        type="button"
        className="text-muted text-sm underline"
        onClick={() => setState("idle")}
      >
        Сбросить в idle
      </button>
    </div>
  );
}

export const ControlledAsync: Story = {
  name: "Контроль asyncState",
  render: () => <ControlledAsyncDemo />,
};

// ─── Gloss variant ───────────────────────────────────────────────────────────

const dottedGridStyle = {
  backgroundImage: "radial-gradient(rgb(128 128 128 / 0.22) 1px, transparent 1px)",
  backgroundSize: "30px 30px",
  backgroundPosition: "2px 2px",
} as const;

function glossDottedDecorator(light = false) {
  return (Story: ComponentType) => (
    <div
      data-theme={light ? "light" : undefined}
      className="box-border flex min-h-[20rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)", ...dottedGridStyle }}
    >
      <Story />
    </div>
  );
}

function GlossDemo() {
  return (
    <div className="flex flex-col items-center gap-xlarge">
      <div className="flex flex-wrap items-center justify-center gap-plus">
        {BUTTON_STATUSES.map((status) => (
          <Button key={status} variant="gloss" status={status} className="capitalize">
            {status}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-plus">
        <Button variant="gloss" size="small">
          Small
        </Button>
        <Button variant="gloss" size="base">
          Base
        </Button>
        <Button variant="gloss" size="mid">
          Mid
        </Button>
        <Button variant="gloss" size="large">
          Generate
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-plus">
        <Button variant="gloss" leftIcon={<IoAdd aria-hidden />}>
          С иконкой
        </Button>
        <Button variant="gloss" iconOnly aria-label="Добавить">
          <IoAdd aria-hidden className="icon-base" />
        </Button>
        <Button variant="gloss" disabled>
          Disabled
        </Button>
      </div>
    </div>
  );
}

export const Gloss: Story = {
  name: "Gloss",
  parameters: { controls: { disable: true } },
  decorators: [glossDottedDecorator(false)],
  render: () => <GlossDemo />,
};

export const GlossLight: Story = {
  name: "Gloss — светлая тема",
  parameters: { controls: { disable: true } },
  decorators: [glossDottedDecorator(true)],
  render: () => <GlossDemo />,
};

export const LabelLayout: Story = {
  name: "Разметка label + shortcut",
  render: () => (
    <Button variant="gloss" type="button" className="w-full max-w-xs justify-between gap-plus">
      <span>Командная палитра</span>
      <span className="inline-flex gap-xsmall">
        <span className="rounded-small bg-surface px-xsmall py-0.5 font-mono text-tools">⌘</span>
        <span className="rounded-small bg-surface px-xsmall py-0.5 font-mono text-tools">K</span>
      </span>
    </Button>
  ),
};

export const CompoundLayout: Story = {
  name: "Compound API",
  render: () => (
    <Button variant="outline" type="button" className="w-full max-w-xs">
      <Button.Label className="justify-between gap-plus">
        <Button.Text>Командная палитра</Button.Text>
        <span className="inline-flex gap-xsmall font-mono text-tools">
          <span>⌘</span>
          <span>K</span>
        </span>
      </Button.Label>
    </Button>
  ),
};
