import type { ComponentType, ChangeEvent } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/components/core/utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/components/core/utils/dualApiStorySource";

import { Input } from "./index";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function ValidatedEmailCompoundDemo({ initialValue = "bad@" }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  const invalid = value.length > 0 && !isValidEmail(value);

  return (
    <Input status={invalid ? "danger" : "default"} isRequired>
      <Input.Label>Email</Input.Label>
      <Input.Control
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        autoComplete="email"
      />
      <Input.Hint>Format: name@domain.tld</Input.Hint>
      {invalid ? <Input.Error>Enter a valid address.</Input.Error> : null}
    </Input>
  );
}

function ValidatedEmailSimpleDemo({ initialValue = "bad@" }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  const invalid = value.length > 0 && !isValidEmail(value);

  return (
    <Input
      label="Email"
      hint="Format: name@domain.tld"
      error={invalid ? "Enter a valid address." : undefined}
      status={invalid ? "danger" : "default"}
      isRequired
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      autoComplete="email"
    />
  );
}

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto min-w-sm">
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
      <div className="mx-auto min-w-sm">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Text field. **Simple** — `label`, `hint`, `error`, and control props on root; **Compound** — `<Input.Label>` / `<Input.Control>` / `<Input.Hint>` / `<Input.Error>`. `variant=\"gloss\"` — glass field shell. **a11y:** `htmlFor`, `aria-describedby` (hint + error), `aria-invalid` when `status=\"danger\"`, `aria-required`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple and Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props on &lt;Input&gt;">
        <Input
          label="Email"
          hint="We do not share your address with third parties."
          placeholder="you@example.com"
          autoComplete="email"
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Input>
          <Input.Label>Email</Input.Label>
          <Input.Control placeholder="you@example.com" autoComplete="email" />
          <Input.Hint>We do not share your address with third parties.</Input.Hint>
        </Input>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const TypeInteraction: Story = {
  name: "Interaction: input",
  render: () => (
    <Input
      label="Email"
      placeholder="you@example.com"
      autoComplete="email"
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByRole("textbox", { name: "Email" });
    await userEvent.type(field, "test@example.com");
    await expect(field).toHaveValue("test@example.com");
  },
};

export const Outline: Story = {
  render: () => (
    <Input>
      <Input.Label>Website</Input.Label>
      <Input.Control variant="outline" placeholder="example.com" />
      <Input.Hint>Outline variant — transparent shell background.</Input.Hint>
    </Input>
  ),
};

export const Secondary: Story = {
  render: () => (
    <Input>
      <Input.Label>Display name</Input.Label>
      <Input.Control variant="secondary" placeholder="Ivan" />
      <Input.Hint>Secondary variant — bg-secondary shell, like Button.</Input.Hint>
    </Input>
  ),
};

export const WithAffixes: Story = {
  render: () => (
    <Input>
      <Input.Label>Domain</Input.Label>
      <Input.Control prefix="https://" suffix=".com" placeholder="example" />
      <Input.Hint>Prefix and suffix with separate background and divider.</Input.Hint>
    </Input>
  ),
};

export const Danger: Story = {
  name: "Danger",
  render: () => (
    <Input status="danger">
      <Input.Label>Email</Input.Label>
      <Input.Control defaultValue="invalid" />
      <Input.Error>Fix the value before submitting the form.</Input.Error>
    </Input>
  ),
};

export const Validation: Story = {
  name: "Validation (hint + error)",
  render: () => (
    <div className="flex w-full flex-col gap-plus">
      <p className="text-sm text-muted">
        Hint — <code className="text-primary">Input.Hint</code> (muted); error message —{" "}
        <code className="text-primary">Input.Error</code> (danger, <code className="text-primary">role=&quot;alert&quot;</code>
        ). Both ids are included in the control's <code className="text-primary">aria-describedby</code>. The error
        clears when a valid email is entered.
      </p>
      <ValidatedEmailCompoundDemo />
      <ValidatedEmailSimpleDemo />
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <Input status="success">
      <Input.Label>Email</Input.Label>
      <Input.Control defaultValue="ok@example.com" />
      <Input.Hint>Address confirmed.</Input.Hint>
    </Input>
  ),
};

export const Warning: Story = {
  render: () => (
    <Input status="warning">
      <Input.Label>Slug</Input.Label>
      <Input.Control defaultValue="draft-v2" />
      <Input.Hint>This identifier is already taken in another project.</Input.Hint>
    </Input>
  ),
};

export const Required: Story = {
  render: () => (
    <Input isRequired>
      <Input.Label>Name</Input.Label>
      <Input.Control placeholder="Ivan" autoComplete="name" />
    </Input>
  ),
};

export const Password: Story = {
  render: () => (
    <Input>
      <Input.Label>Password</Input.Label>
      <Input.Control inputType="password" placeholder="••••••••" autoComplete="current-password" />
      <Input.Hint>At least 8 characters.</Input.Hint>
    </Input>
  ),
};

export const File: Story = {
  render: () => (
    <Input>
      <Input.Label>Avatar</Input.Label>
      <Input.Control inputType="file" accept="image/*" />
    </Input>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-plus">
      <Input size="small">
        <Input.Label>Small</Input.Label>
        <Input.Control placeholder="small" />
      </Input>
      <Input size="base">
        <Input.Label>Base</Input.Label>
        <Input.Control placeholder="base" />
      </Input>
      <Input size="mid">
        <Input.Label>Mid</Input.Label>
        <Input.Control placeholder="mid" />
      </Input>
      <Input size="large">
        <Input.Label>Large</Input.Label>
        <Input.Control placeholder="large" />
      </Input>
    </div>
  ),
};

export const LightTheme: Story = {
  decorators: [...lightThemeDecorator],
  render: () => (
    <Input>
      <Input.Label>Email</Input.Label>
      <Input.Control placeholder="you@example.com" />
    </Input>
  ),
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div className="flex flex-col gap-plus text-left">
      <p className="text-sm text-muted">
        <code className="text-primary">&lt;Label htmlFor&gt;</code> via{" "}
        <code className="text-primary">FieldLabelContext</code>. Hint and error — via{" "}
        <code className="text-primary">aria-describedby</code> (both ids when set). When{" "}
        <code className="text-primary">status=&quot;danger&quot;</code> —{" "}
        <code className="text-primary">aria-invalid</code> on the control; error —{" "}
        <code className="text-primary">Input.Error</code>, not a tinted hint.
      </p>
      <ValidatedEmailCompoundDemo />
    </div>
  ),
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
      className="box-border flex min-h-[22rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)", ...dottedGridStyle }}
    >
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  );
}

function GlossDemo() {
  return (
    <div className="flex w-full flex-col gap-plus">
      <Input>
        <Input.Label>Email</Input.Label>
        <Input.Control variant="gloss" placeholder="you@example.com" autoComplete="email" />
        <Input.Hint>variant=&quot;gloss&quot; — glass field shell.</Input.Hint>
      </Input>
      <Input>
        <Input.Label>Domain</Input.Label>
        <Input.Control variant="gloss" prefix="https://" suffix=".com" placeholder="example" />
      </Input>
      <Input>
        <Input.Label>Password</Input.Label>
        <Input.Control
          variant="gloss"
          inputType="password"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </Input>
      <div className="flex flex-col gap-base">
        <Input size="small">
          <Input.Label>Small</Input.Label>
          <Input.Control variant="gloss" placeholder="small" />
        </Input>
        <Input size="base">
          <Input.Label>Base</Input.Label>
          <Input.Control variant="gloss" placeholder="base" />
        </Input>
        <Input size="mid">
          <Input.Label>Mid</Input.Label>
          <Input.Control variant="gloss" placeholder="mid" />
        </Input>
        <Input size="large">
          <Input.Label>Large</Input.Label>
          <Input.Control variant="gloss" placeholder="large" />
        </Input>
      </div>
      <Input status="danger">
        <Input.Label>Email</Input.Label>
        <Input.Control variant="gloss" defaultValue="bad@" />
        <Input.Error>Enter a valid address.</Input.Error>
      </Input>
      <Input disabled>
        <Input.Label>Disabled</Input.Label>
        <Input.Control variant="gloss" defaultValue="readonly@example.com" />
      </Input>
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
  name: "Gloss — light theme",
  parameters: { controls: { disable: true } },
  decorators: [glossDottedDecorator(true)],
  render: () => <GlossDemo />,
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Input",
      },
    },
  },
  render: () => (
    <Input
      className="max-w-sm"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        shell: "ring-1 ring-primary/15",
        control: "text-primary placeholder:text-primary/50",
        hint: "text-foreground/70",
        error: "font-medium",
      }}
      label="Email"
      placeholder="you@example.com"
      status="danger"
      hint="We do not share your address with third parties."
      error="Enter a valid email."
    />
  ),
};
