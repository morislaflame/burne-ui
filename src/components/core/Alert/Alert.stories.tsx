import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert } from "./Alert";
import { Button } from "../Button";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border w-full p-8 text-b-text"
      style={{ backgroundColor: "var(--b-color-bg)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-b-theme="light"
      className="box-border w-full p-8 text-b-text"
      style={{ backgroundColor: "var(--b-color-bg)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const infoIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

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
        "destructive",
        "success",
        "info",
        "accent",
        "danger",
        "warning",
      ],
    },
    variant: {
      control: "select",
      options: ["default", "outline", "destructive", "success", "info"],
    },
    children: {
      control: false,
      table: { type: { summary: "ReactNode" } },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

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
    <Alert status="accent">
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
        <Button size="s" variant="outline">
          Refresh
        </Button>
      </Alert.Action>
    </Alert>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
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
            <Alert.Description>Контурный стиль без заливки.</Alert.Description>
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
          <Button size="s" variant="destructive">
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

      <Alert status="accent">
        <Alert.Message>
          <Alert.Indicator>{infoIcon}</Alert.Indicator>
          <Alert.Content>
            <Alert.Title>Processing your request</Alert.Title>
            <Alert.Description>
              Please wait while we sync your data. This may take a few moments.
            </Alert.Description>
          </Alert.Content>
        </Alert.Message>
      </Alert>
    </div>
  ),
};

export const OnLightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
  render: () => (
    <Alert status="info">
      <Alert.Message>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Light theme alert</Alert.Title>
          <Alert.Description>
            This example uses the same compound API on `data-b-theme=&quot;light&quot;`.
          </Alert.Description>
        </Alert.Content>
      </Alert.Message>
    </Alert>
  ),
};
