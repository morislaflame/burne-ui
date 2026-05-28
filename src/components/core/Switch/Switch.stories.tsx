import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoMoon, IoSunny } from "react-icons/io5";

import { Switch } from "./Switch";

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
  title: "Core Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Переключатель с кружком как у `Slider`: кружок ездит внутри трека с отступами. Без иконок — accent-заливка при включении; с иконками — accent-иконка в выключенном состоянии и accent-foreground на заливке кружка при включении.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  args: {
    size: "base" as const,
    labelPosition: "right" as const,
    disabled: false,
    defaultChecked: false,
  },
  argTypes: {
    size: { control: "select", options: ["small", "base", "medium", "large"] },
    labelPosition: { control: "select", options: ["left", "right"] },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: "Уведомления",
    description: "Push-сообщения о новых событиях",
  },
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex flex-col gap-mid">
      {(["small", "base", "medium", "large"] as const).map((size) => (
        <Switch
          key={size}
          size={size}
          label={`Размер ${size}`}
          defaultChecked={size === "base"}
        />
      ))}
    </div>
  ),
};

export const CustomThickness: Story = {
  name: "Своя толщина",
  render: () => (
    <div className="flex flex-col gap-mid">
      <Switch label="10px" thickness={10} defaultChecked />
      <Switch label="1.25rem" thickness="1.25rem" defaultChecked />
      <Switch
        label="size=small + thickness=20"
        size="small"
        thickness={20}
        defaultChecked
      />
    </div>
  ),
};

export const LabelLeft: Story = {
  name: "Лейбл слева",
  args: {
    label: "Тёмная тема",
    description: "Переключить оформление интерфейса",
    labelPosition: "left",
    defaultChecked: true,
  },
};

export const WithIcons: Story = {
  name: "С иконками",
  render: () => (
    <Switch
      label="Тема"
      description="Светлая или тёмная"
      defaultChecked
      iconOff={<IoMoon aria-hidden className="size-full" />}
      iconOn={<IoSunny aria-hidden className="size-full" />}
    />
  ),
};

export const CustomColor: Story = {
  name: "Свой цвет",
  render: () => (
    <div className="flex flex-col gap-mid">
      <Switch
        label="Accent (по умолчанию)"
        description="Трек accent, заливка кружка — тоже accent"
        defaultChecked
      />
      <Switch
        label="Success"
        description="var(--color-success)"
        color="var(--color-success)"
        defaultChecked
      />
      <Switch
        label="Danger"
        description="var(--color-danger)"
        color="var(--color-danger)"
        defaultChecked
      />
      <Switch
        label="Warning"
        description="var(--color-warning)"
        color="var(--color-warning)"
        defaultChecked
      />
      <Switch
        label="Info"
        description="var(--color-info)"
        color="var(--color-info)"
        defaultChecked
      />
      <Switch
        label="Hex"
        description="#7c3aed"
        color="#7c3aed"
        defaultChecked
      />
      <Switch
        label="Градиент"
        description="linear-gradient accent → info"
        color="linear-gradient(90deg, var(--color-accent) 0%, var(--color-info) 100%)"
        defaultChecked
      />
      <Switch
        label="Градиент warm"
        description="orange → pink"
        color="linear-gradient(135deg, #f97316 0%, #ec4899 100%)"
        defaultChecked
      />
      <Switch
        label="С иконками + градиент"
        description="Accent-иконка / accent-foreground на заливке, трек с градиентом"
        color="linear-gradient(90deg, var(--color-success) 0%, var(--color-accent) 100%)"
        defaultChecked
        iconOff={<IoMoon aria-hidden className="size-full" />}
        iconOn={<IoSunny aria-hidden className="size-full" />}
      />
    </div>
  ),
};

export const WithoutLabel: Story = {
  name: "Без подписи",
  args: {
    label: undefined,
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  name: "Отключён",
  args: {
    label: "Недоступно",
    description: "Переключатель заблокирован",
    disabled: true,
    defaultChecked: true,
  },
};

function ControlledDemo() {
  const [on, setOn] = useState(false);
  return (
    <Switch
      label="Контролируемый"
      description={`Сейчас: ${on ? "вкл" : "выкл"}`}
      checked={on}
      onChange={(e) => setOn(e.target.checked)}
    />
  );
}

export const Controlled: Story = {
  name: "Контролируемый",
  render: () => <ControlledDemo />,
};

export const OnLightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
  args: {
    label: "Светлая тема",
    defaultChecked: true,
  },
};
