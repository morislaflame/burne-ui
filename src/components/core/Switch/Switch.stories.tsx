import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoMoon, IoSunny } from "react-icons/io5";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/stories-utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/stories-utils/dualApiStorySource";

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
          "Switch. **Simple** — `label`, `hint`, and control props on root; **Compound** — `<Switch.Control>` + `<Switch.Content>` with `<Switch.Label>` / `<Switch.Hint>`.",
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
  name: "Simple and Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props on &lt;Switch&gt;">
        <Switch
          label="Notifications"
          hint="Push notifications about new events"
          defaultChecked
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Switch>
          <Switch.Control defaultChecked />
          <Switch.Content>
            <Switch.Label>Notifications</Switch.Label>
            <Switch.Hint>Push notifications about new events</Switch.Hint>
          </Switch.Content>
        </Switch>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const ToggleInteraction: Story = {
  name: "Interaction: toggle",
  render: function ToggleInteractionDemo() {
    const [on, setOn] = useState(false);
    return (
      <Switch
        label="Notifications"
        hint={`Currently: ${on ? "on" : "off"}`}
        checked={on}
        onChange={(e) => setOn(e.target.checked)}
      />
    );
  },
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch", { name: /Notifications/ });
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(canvas.getByText(/Currently: on/)).toBeVisible();
  },
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-col gap-mid">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <Switch key={size} size={size} label={`Size ${size}`} defaultChecked={size === "base"} />
      ))}
    </div>
  ),
};

export const CustomThickness: Story = {
  name: "Custom thickness",
  render: () => (
    <div className="flex flex-col gap-mid">
      <Switch label="10px" thickness={10} defaultChecked />
      <Switch label="1.25rem" thickness="1.25rem" defaultChecked />
      <Switch label="size=small + thickness=20" size="small" thickness={20} defaultChecked />
    </div>
  ),
};

export const LabelLeft: Story = {
  name: "Label on the left",
  render: () => (
    <Switch
      label="Dark theme"
      hint="Toggle interface theme"
      labelPosition="left"
      defaultChecked
    />
  ),
};

export const WithIcons: Story = {
  name: "With icons",
  render: () => (
    <Switch
      label="Topic"
      hint="Light or dark"
      defaultChecked
      iconOff={<IoMoon aria-hidden className="size-full" />}
      iconOn={<IoSunny aria-hidden className="size-full" />}
    />
  ),
};

export const CompoundTrack: Story = {
  name: "Compound Track",
  render: () => (
    <Switch label="Topic" hint="Switch.Track + Thumb + Icon">
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
  name: "Custom color",
  render: () => (
    <div className="flex flex-col gap-mid">
      <Switch label="Primary (default)" hint="Primary track" defaultChecked />
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
        label="Gradient"
        hint="linear-gradient primary → info"
        color="linear-gradient(90deg, var(--color-primary) 0%, var(--color-info) 100%)"
        defaultChecked
      />
      <Switch
        label="Gradient warm"
        hint="orange → pink"
        color="linear-gradient(135deg, #f97316 0%, #ec4899 100%)"
        defaultChecked
      />
      <Switch
        label="With icons + gradient"
        hint="Accent icon on fill"
        color="linear-gradient(90deg, var(--color-success) 0%, var(--color-primary) 100%)"
        defaultChecked
        iconOff={<IoMoon aria-hidden className="size-full" />}
        iconOn={<IoSunny aria-hidden className="size-full" />}
      />
    </div>
  ),
};

export const WithoutLabel: Story = {
  name: "Without label",
  render: () => (
    <div className="flex flex-col gap-mid">
      <Switch defaultChecked />
      <Switch aria-label="Dark theme" defaultChecked />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <Switch label="Unavailable" hint="Switch is disabled" disabled defaultChecked />
  ),
};

export const Controlled: Story = {
  name: "Controlled",
  render: function Controlled() {
    const [on, setOn] = useState(false);
    return (
      <Switch
        label="Controlled"
        hint={`Currently: ${on ? "on" : "off"}`}
        checked={on}
        onChange={(e) => setOn(e.target.checked)}
      />
    );
  },
};

export const OnLightTheme: Story = {
  name: "Light theme",
  decorators: [...lightThemeDecorator],
  render: () => <Switch label="Light theme" defaultChecked />,
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Simple and compound — native <code className="text-primary">&lt;label&gt;</code> around input and
        text. Hint and error are linked via{" "}
        <code className="text-primary">aria-describedby</code> (both ids when set). Without label
        — fallback <code className="text-primary">aria-label=&quot;Toggle&quot;</code> or your own
        label.
      </p>
      <Switch
        id="a11y-switch-simple"
        label="Notifications"
        hint="Push notifications about new events"
        defaultChecked
      />
      <Switch id="a11y-switch-compound">
        <Switch.Control defaultChecked />
        <Switch.Content>
          <Switch.Label>Email newsletter</Switch.Label>
          <Switch.Hint>Weekly digest</Switch.Hint>
        </Switch.Content>
      </Switch>
      <Switch
        label="Marketing"
        hint="Promotional offers by email"
        error="Enable to continue registration."
      />
      <Switch aria-label="Toggle only" />
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Switch (compound API)",
      },
    },
  },
  render: () => (
    <Switch
      defaultChecked
      gloss
      classNames={{
        root: "rounded-mid border border-primary/25 p-base",
        track: "ring-1 ring-primary/20",
        fill: "bg-primary/90",
        labelText: "text-primary font-semibold",
        hint: "text-muted/80",
      }}
    >
      <Switch.Control />
      <Switch.Content>
        <Switch.Label>Dark theme</Switch.Label>
        <Switch.Hint>All slots configured via classNames.</Switch.Hint>
      </Switch.Content>
    </Switch>
  ),
};

export const SimpleLabelClassNames: Story = {
  name: "Simple API — classNames.label",
  parameters: {
    docs: {
      description: {
        story: "In simple API, label and labelText slots style the root label.",
      },
    },
  },
  render: () => (
    <Switch
      defaultChecked
      label="Push notifications"
      hint="classNames.label applies to the label cell."
      classNames={{
        label: "text-success",
        labelText: "font-semibold underline decoration-success/30 underline-offset-4",
        hint: "text-muted/80",
      }}
      className="max-w-md"
    />
  ),
};
