import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/components/core/utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/components/core/utils/dualApiStorySource";
import { Button } from "@/components/core/Button";

import { Alert } from ".";

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
          "Сообщение пользователю. **Simple** — `title`, `description`, `icon`, `action` на root. **Compound** — `Message`, `Indicator`, `Content`, `Title`, `Description`, `Action`. **a11y:** auto-`id`, `aria-labelledby` / `aria-describedby`; для `danger`/`warning` — `role=\"alert\"`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    status: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "danger",
        "success",
        "info",
        "warning",
      ],
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
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

function AlertAllVariantsDemo({ simple = false }: { simple?: boolean }) {
  const items = [
    {
      status: "default" as const,
      title: "Default",
      description: "Нейтральное сообщение.",
    },
    {
      status: "outline" as const,
      title: "Outline",
      description: "Полупрозрачный фон с размытием.",
    },
    {
      status: "secondary" as const,
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
            key={item.status}
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
        <Alert key={item.status} status={item.status}>
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
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — Message / Indicator">
        <Alert status="info">
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
};

export const Variants: Story = {
  name: "Варианты (тёмная тема)",
  render: () => <AlertAllVariantsDemo />,
};

export const VariantsSimple: Story = {
  name: "Варианты — simple API",
  render: () => <AlertAllVariantsDemo simple />,
};

export const VariantsOnLightTheme: Story = {
  name: "Варианты (светлая тема)",
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
