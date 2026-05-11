import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert } from "./Alert";
import { Button } from "@/components/core/Button";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border w-full p-xlarge text-foreground"
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
      className="box-border w-full p-xlarge text-foreground"
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
  parameters: { layout: "fullscreen" },
  decorators: [...darkThemeDecorator],
  args: {
    variant: "default",
  },
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
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "danger", "success", "info"],
    },
    children: {
      control: false,
      table: { type: { summary: "ReactNode" } },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

function AlertAllVariantsDemo() {
  return (
    <div className="flex flex-col gap-plus">
      <Alert status="default">
        <Alert.Message>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Default</Alert.Title>
            <Alert.Description>Нейтральное сообщение.</Alert.Description>
          </Alert.Content>
        </Alert.Message>
      </Alert>

      <Alert status="outline">
        <Alert.Message>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Outline</Alert.Title>
            <Alert.Description>Полупрозрачный фон с размытием.</Alert.Description>
          </Alert.Content>
        </Alert.Message>
      </Alert>

      <Alert status="secondary">
        <Alert.Message>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Secondary</Alert.Title>
            <Alert.Description>Тот же фон, что у бейджа/кнопки secondary.</Alert.Description>
          </Alert.Content>
        </Alert.Message>
      </Alert>

      <Alert status="danger">
        <Alert.Message>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Unable to connect to server</Alert.Title>
            <Alert.Description>
              We&apos;re experiencing connection issues.
            </Alert.Description>
          </Alert.Content>
        </Alert.Message>
        <Alert.Action>
          <Button size="base" variant="danger">
            Retry
          </Button>
        </Alert.Action>
      </Alert>

      <Alert status="success">
        <Alert.Message>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Profile updated successfully</Alert.Title>
          </Alert.Content>
        </Alert.Message>
      </Alert>

      <Alert status="info">
        <Alert.Message>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Справка</Alert.Title>
            <Alert.Description>
              Дополнительная информация в нейтрально-информационном тоне.
            </Alert.Description>
          </Alert.Content>
        </Alert.Message>
      </Alert>

      <Alert status="warning">
        <Alert.Message>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Scheduled maintenance</Alert.Title>
            <Alert.Description>
              Services will be unavailable Sunday from 2:00 AM to 6:00 AM UTC.
            </Alert.Description>
          </Alert.Content>
        </Alert.Message>
      </Alert>
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
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
  ),
};

export const WithAction: Story = {
  render: () => (
    <Alert status="info">
      <Alert.Message>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Update available</Alert.Title>
          <Alert.Description>
            A new version of the application is available. Please refresh to get the
            latest features and bug fixes.
          </Alert.Description>
        </Alert.Content>
      </Alert.Message>
      <Alert.Action>
        <Button size="base" variant="info">
          Refresh
        </Button>
      </Alert.Action>
    </Alert>
  ),
};

export const Variants: Story = {
  name: "Варианты (тёмная тема)",
  render: () => <AlertAllVariantsDemo />,
};

export const VariantsOnLightTheme: Story = {
  name: "Варианты (светлая тема)",
  decorators: [...lightThemeDecorator],
  render: () => <AlertAllVariantsDemo />,
};
