import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/components/core/utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/components/core/utils/dualApiStorySource";
import { Button } from "@/components/core/Button";
import { glossDottedDecorator } from "@/components/core/utils/glossStoryChrome";

import { Alert, type AlertSize, type AlertStatus, type AlertVariant } from ".";

const ALERT_VARIANTS: AlertVariant[] = ["default", "outline", "secondary", "gloss"];

const ALERT_STATUSES: AlertStatus[] = [
  "default",
  "danger",
  "success",
  "info",
  "warning",
];

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-md">
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
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Сообщение пользователю. **Simple** — `title`, `description`, `icon`, `action` на root. **Compound** — `Message`, `Indicator`, `Content`, `Title`, `Description`, `Action`. `variant` — визуальный стиль (`default`, `outline`, `secondary`, `gloss`); `status` — семантика (`danger`, `success`, `info`, `warning`). `hoverLift={false}` — без анимации подъёма при наведении. Слоты можно настраивать через `classNames` на root (`root`, `indicator`, `message`, `content`, `title`, `description`, `action`). **a11y:** auto-`id`, `aria-labelledby` / `aria-describedby`; для `status=\"danger\"`/`\"warning\"` — `role=\"alert\"`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "gloss"],
    },
    status: {
      control: "select",
      options: ["default", "danger", "success", "info", "warning"],
    },
    size: {
      control: "select",
      options: ["small", "base", "mid", "large"],
      table: { defaultValue: { summary: "base" } },
    },
    children: {
      control: false,
      table: { type: { summary: "ReactNode" } },
    },
    action: {
      control: false,
      table: { type: { summary: "ReactNode" } },
    },
    icon: {
      control: false,
      table: { type: { summary: "ReactNode | null" } },
    },
    hoverLift: {
      control: "boolean",
      description: "Подъём и тень при наведении (как у Badge).",
      table: { defaultValue: { summary: "true" } },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

function AlertMatrixItem({
  variant,
  status,
  title,
}: {
  variant: AlertVariant;
  status: AlertStatus;
  title?: string;
}) {
  return (
    <Alert variant={variant} status={status} hoverLift={false} className="w-full">
      <Alert.Message>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title className="capitalize">
            {title ?? variant}
          </Alert.Title>
          <Alert.Description>
            variant=&quot;{variant}&quot; · status=&quot;{status}&quot;
          </Alert.Description>
        </Alert.Content>
      </Alert.Message>
    </Alert>
  );
}

function VariantsOnlyDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-plus py-mid">
      {ALERT_VARIANTS.map((variant) => (
        <AlertMatrixItem key={variant} variant={variant} status="default" />
      ))}
    </div>
  );
}

function StatusVariantsDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-xlarge py-mid">
      {ALERT_STATUSES.map((status) => (
        <div key={status} className="flex flex-col gap-base">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            status: {status}
          </span>
          <div className="flex flex-col gap-plus">
            {ALERT_VARIANTS.map((variant) => (
              <AlertMatrixItem
                key={`${status}-${variant}`}
                variant={variant}
                status={status}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AlertAllVariantsDemo({ simple = false }: { simple?: boolean }) {
  const items = [
    {
      variant: "default" as const,
      title: "Default",
      description: "Нейтральное сообщение.",
    },
    {
      variant: "outline" as const,
      title: "Outline",
      description: "Полупрозрачный фон с обводкой.",
    },
    {
      variant: "secondary" as const,
      title: "Secondary",
      description: "Тот же фон, что у бейджа/кнопки secondary.",
    },
    {
      status: "danger" as const,
      title: "Unable to connect to server",
      description: "We're experiencing connection issues.",
      action: (
        <Button size="small" variant="primary" status="danger">
          Retry
        </Button>
      ),
    },
    {
      status: "success" as const,
      title: "Profile updated successfully",
    },
    {
      status: "info" as const,
      title: "Справка",
      description: "Дополнительная информация в нейтрально-информационном тоне.",
    },
    {
      status: "warning" as const,
      title: "Scheduled maintenance",
      description: "Services will be unavailable Sunday from 2:00 AM to 6:00 AM UTC.",
    },
  ];

  if (simple) {
    return (
      <div className="flex flex-col gap-plus">
        {items.map((item) => (
          <Alert
            key={`${item.variant ?? "default"}-${item.status ?? "default"}`}
            variant={item.variant}
            status={item.status}
            title={item.title}
            description={item.description}
            action={item.action}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-plus">
      {items.map((item) => (
        <Alert
          key={`${item.variant ?? "default"}-${item.status ?? "default"}`}
          variant={item.variant}
          status={item.status}
        >
          <Alert.Message>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{item.title}</Alert.Title>
              {item.description ? (
                <Alert.Description>{item.description}</Alert.Description>
              ) : null}
            </Alert.Content>
          </Alert.Message>
          {item.action ? <Alert.Action>{item.action}</Alert.Action> : null}
        </Alert>
      ))}
    </div>
  );
}

export const Default: Story = {
  name: "Simple и Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props на &lt;Alert&gt;">
        <Alert
          status="info"
          title="Heads up!"
          description="You can add components and dependencies to your app using the cli."
          hoverLift={false}
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — Message / Indicator">
        <Alert status="info" hoverLift={false}>
          <Alert.Message>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Heads up!</Alert.Title>
              <Alert.Description>
                You can add components and dependencies to your app using the cli.
              </Alert.Description>
            </Alert.Content>
          </Alert.Message>
        </Alert>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const Playground: Story = {
  args: {
    status: "info",
    title: "Heads up!",
    description: "You can add components and dependencies to your app using the cli.",
  },
};

export const WithAction: Story = {
  render: () => (
    <Alert
      status="info"
      title="Update available"
      description="A new version of the application is available. Please refresh to get the latest features and bug fixes."
      action={
        <Button size="small" variant="primary" status="info">
          Refresh
        </Button>
      }
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const action = canvas.getByRole("button", { name: "Refresh" });
    await userEvent.click(action);
    await expect(action).toHaveFocus();
  },
};

export const Variants: Story = {
  name: "Варианты (тёмная тема)",
  render: () => <VariantsOnlyDemo />,
};

export const VariantsSimple: Story = {
  name: "Варианты — simple API",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-plus py-mid">
      {ALERT_VARIANTS.map((variant) => (
        <Alert
          key={variant}
          variant={variant}
          title={variant}
          description={`variant="${variant}" · status="default"`}
          hoverLift={false}
        />
      ))}
    </div>
  ),
};

export const VariantsOnLightTheme: Story = {
  name: "Варианты (светлая тема)",
  decorators: [...lightThemeDecorator],
  render: () => <VariantsOnlyDemo />,
};

export const StatusVariants: Story = {
  name: "Статусы × варианты (тёмная тема)",
  render: () => <StatusVariantsDemo />,
};

export const StatusVariantsOnLightTheme: Story = {
  name: "Статусы × варианты (светлая тема)",
  decorators: [...lightThemeDecorator],
  render: () => <StatusVariantsDemo />,
};

export const Overview: Story = {
  name: "Обзор (variant + status)",
  render: () => <AlertAllVariantsDemo />,
};

export const OverviewSimple: Story = {
  name: "Обзор — simple API",
  render: () => <AlertAllVariantsDemo simple />,
};

export const OverviewOnLightTheme: Story = {
  name: "Обзор (светлая тема)",
  decorators: [...lightThemeDecorator],
  render: () => <AlertAllVariantsDemo />,
};

export const Accessibility: Story = {
  name: "Доступность (auto id + role)",
  render: () => (
    <div className="flex flex-col gap-plus">
      <Alert
        status="danger"
        title="Не удалось сохранить"
        description="Проверьте соединение и повторите попытку."
      />
      <Alert
        status="info"
        title="Черновик сохранён"
        description="Синхронизация выполняется в фоне."
      />
    </div>
  ),
};

const GLOSS_ALERT_STATUSES = ["danger", "success", "info", "warning"] as const;

function GlossDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-plus">
      {GLOSS_ALERT_STATUSES.map((status) => (
        <Alert key={status} variant="gloss" status={status}>
          <Alert.Message>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title className="capitalize">{status}</Alert.Title>
              <Alert.Description>
                variant=&quot;gloss&quot; — статус только в тексте и иконке.
              </Alert.Description>
            </Alert.Content>
          </Alert.Message>
        </Alert>
      ))}
      <Alert variant="gloss" status="info" title="Simple API" description="Props title и description на корне." />
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

export const NoHoverLift: Story = {
  name: "Без hover-lift",
  args: {
    status: "info",
    title: "Статичный alert",
    description: "hoverLift={false} — без подъёма и усиления тени при наведении.",
    hoverLift: false,
  },
};

export const CustomClassNames: Story = {
  name: "Полная кастомизация classNames",
  parameters: {
    docs: {
      description: {
        story:
          "кастомизация classNames для Alert",
      },
    },
  },
  render: () => (
    <Alert
      status="success"
      classNames={{
        root: "rounded-large border-success/50 bg-success/10",
        message: "items-start",
        indicator: "text-success",
        content: "gap-xsmall",
        title: "text-success font-semibold",
        description: "text-foreground/80",
        action: "self-start",
      }}
      className="max-w-lg"
    >
      <Alert.Message>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Профиль обновлён</Alert.Title>
          <Alert.Description>Все слоты настроены через classNames.</Alert.Description>
        </Alert.Content>
      </Alert.Message>
      <Alert.Action>
        <Button size="small">Открыть</Button>
      </Alert.Action>
    </Alert>
  ),
};

const ALERT_SIZES: AlertSize[] = ["small", "base", "mid", "large"];

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-plus">
      {ALERT_SIZES.map((size) => (
        <Alert key={size} status="info" size={size} className="w-full">
          <Alert.Message>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>size={size}</Alert.Title>
              <Alert.Description>
                Padding, иконка и типографика масштабируются по размерной сетке.
              </Alert.Description>
            </Alert.Content>
          </Alert.Message>
        </Alert>
      ))}
    </div>
  ),
};
