import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoMoon, IoSunny } from "react-icons/io5";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
  dualApiStorySource,
} from "@/components/core/utils/dualApiStoryChrome";

import { Switch } from ".";

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
          "Переключатель. **Simple** — `label`, `hint` и props контрола на root; **Compound** — `<Switch.Control>` + `<Switch.Content>` с `<Switch.Label>` / `<Switch.Hint>`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    size: { control: "select", options: ["small", "base", "mid", "large"] },
    labelPosition: { control: "select", options: ["left", "right"] },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple и Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props на &lt;Switch&gt;">
        <Switch
          label="Уведомления"
          hint="Push-сообщения о новых событиях"
          defaultChecked
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Switch>
          <Switch.Control defaultChecked />
          <Switch.Content>
            <Switch.Label>Уведомления</Switch.Label>
            <Switch.Hint>Push-сообщения о новых событиях</Switch.Hint>
          </Switch.Content>
        </Switch>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex flex-col gap-mid">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <Switch key={size} size={size} label={`Размер ${size}`} defaultChecked={size === "base"} />
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
      <Switch label="size=small + thickness=20" size="small" thickness={20} defaultChecked />
    </div>
  ),
};

export const LabelLeft: Story = {
  name: "Лейбл слева",
  render: () => (
    <Switch
      label="Тёмная тема"
      hint="Переключить оформление интерфейса"
      labelPosition="left"
      defaultChecked
    />
  ),
};

export const WithIcons: Story = {
  name: "С иконками",
  render: () => (
    <Switch
      label="Тема"
      hint="Светлая или тёмная"
      defaultChecked
      iconOff={<IoMoon aria-hidden className="size-full" />}
      iconOn={<IoSunny aria-hidden className="size-full" />}
    />
  ),
};

export const CompoundTrack: Story = {
  name: "Compound Track",
  render: () => (
    <Switch label="Тема" hint="Switch.Track + Thumb + Icon">
      <Switch.Control defaultChecked>
        <Switch.Track size="base">
          <Switch.Fill />
          <Switch.Thumb>
            <Switch.Icon when="off">
              <IoMoon aria-hidden className="size-full" />
            </Switch.Icon>
            <Switch.Icon when="on">
              <IoSunny aria-hidden className="size-full" />
            </Switch.Icon>
          </Switch.Thumb>
        </Switch.Track>
      </Switch.Control>
    </Switch>
  ),
};

export const CustomColor: Story = {
  name: "Свой цвет",
  render: () => (
    <div className="flex flex-col gap-mid">
      <Switch label="Accent (по умолчанию)" hint="Трек accent" defaultChecked />
      <Switch
        label="Success"
        hint="var(--color-success)"
        color="var(--color-success)"
        defaultChecked
      />
      <Switch
        label="Danger"
        hint="var(--color-danger)"
        color="var(--color-danger)"
        defaultChecked
      />
      <Switch
        label="Warning"
        hint="var(--color-warning)"
        color="var(--color-warning)"
        defaultChecked
      />
      <Switch label="Info" hint="var(--color-info)" color="var(--color-info)" defaultChecked />
      <Switch label="Hex" hint="#7c3aed" color="#7c3aed" defaultChecked />
      <Switch
        label="Градиент"
        hint="linear-gradient accent → info"
        color="linear-gradient(90deg, var(--color-accent) 0%, var(--color-info) 100%)"
        defaultChecked
      />
      <Switch
        label="Градиент warm"
        hint="orange → pink"
        color="linear-gradient(135deg, #f97316 0%, #ec4899 100%)"
        defaultChecked
      />
      <Switch
        label="С иконками + градиент"
        hint="Accent-иконка на заливке"
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
  render: () => (
    <div className="flex flex-col gap-mid">
      <Switch defaultChecked />
      <Switch aria-label="Тёмная тема" defaultChecked />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Отключён",
  render: () => (
    <Switch label="Недоступно" hint="Переключатель заблокирован" disabled defaultChecked />
  ),
};

export const Controlled: Story = {
  name: "Контролируемый",
  render: function Controlled() {
    const [on, setOn] = useState(false);
    return (
      <Switch
        label="Контролируемый"
        hint={`Сейчас: ${on ? "вкл" : "выкл"}`}
        checked={on}
        onChange={(e) => setOn(e.target.checked)}
      />
    );
  },
};

export const OnLightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
  render: () => <Switch label="Светлая тема" defaultChecked />,
};

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Simple и compound — native <code className="text-accent">&lt;label&gt;</code> вокруг input и
        текста. Hint и error связываются через{" "}
        <code className="text-accent">aria-describedby</code> (оба id, если заданы). Без подписи
        — fallback <code className="text-accent">aria-label=&quot;Переключатель&quot;</code> или свой
        label.
      </p>
      <Switch
        id="a11y-switch-simple"
        label="Уведомления"
        hint="Push-сообщения о новых событиях"
        defaultChecked
      />
      <Switch id="a11y-switch-compound">
        <Switch.Control defaultChecked />
        <Switch.Content>
          <Switch.Label>Email-рассылка</Switch.Label>
          <Switch.Hint>Еженедельный дайджест</Switch.Hint>
        </Switch.Content>
      </Switch>
      <Switch
        label="Маркетинг"
        hint="Рекламные предложения по email"
        error="Включите для продолжения регистрации."
      />
      <Switch aria-label="Только переключатель" />
    </div>
  ),
};
