import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoTimeOutline } from "react-icons/io5";

import { Text } from "@/components/core/Text";
import { DualApiStoryPanel, DualApiStoryPanels } from "@/stories-utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/stories-utils/dualApiStorySource";

import { TimeField } from "./index";

function isValidTime(value: string) {
  const parts = value.split(":").map(Number);
  if (parts.length < 2) return false;
  const [h, m, s = 0] = parts;
  return h >= 0 && h <= 23 && m >= 0 && m <= 59 && s >= 0 && s <= 59;
}

function ValidatedTimeCompoundDemo({ initialValue = "25:00" }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  const invalid = value.length > 0 && !isValidTime(value);

  return (
    <TimeField status={invalid ? "danger" : "default"} required>
      <TimeField.Label>Shift start</TimeField.Label>
      <TimeField.Control
        value={value}
        onValueChange={setValue}
        prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
      />
      <TimeField.Hint>Format: HH:MM (24-hour)</TimeField.Hint>
      {invalid ? <TimeField.Error>Enter a valid time.</TimeField.Error> : null}
    </TimeField>
  );
}

function ValidatedTimeSimpleDemo({ initialValue = "25:00" }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  const invalid = value.length > 0 && !isValidTime(value);

  return (
    <TimeField
      label="Shift start"
      hint="Format: HH:MM (24-hour)"
      error={invalid ? "Enter a valid time." : undefined}
      status={invalid ? "danger" : "default"}
      required
      value={value}
      onValueChange={setValue}
      prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
    />
  );
}

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

const meta = {
  title: "Core Components/TimeField",
  component: TimeField,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Time input field. **Simple** — `label`, `hint`, `error`, `prefix`, `suffix`, and control props on root; **Compound** — `<TimeField.Label>` / `<TimeField.Control>` / `<TimeField.Hint>` / `<TimeField.Error>`. Variants: `default`, `outline`, `segmented`. `compact` prop — shell sized to the time width. **a11y:** `aria-describedby`, `aria-invalid` when `status=\"danger\"`, `role=\"spinbutton\"` on segments.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof TimeField>;

export default meta;
type Story = StoryObj<typeof meta>;

function DualApiDemo() {
  return (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props on &lt;TimeField&gt;">
        <TimeField
          label="Meeting time"
          hint="24-hour format"
          defaultValue="09:30"
          prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <TimeField>
          <TimeField.Label>Meeting time</TimeField.Label>
          <TimeField.Control
            defaultValue="09:30"
            prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
          />
          <TimeField.Hint>24-hour format</TimeField.Hint>
        </TimeField>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  );
}

export const Default: Story = {
  name: "Dual API",
  ...dualApiStorySource,
  render: () => <DualApiDemo />,
};

export const Segmented: Story = {
  name: "Segmented",
  render: () => {
    const [value, setValue] = useState("14:30");
    return (
      <TimeField>
        <TimeField.Label>Segmented</TimeField.Label>
        <TimeField.Control
          variant="segmented"
          value={value}
          onValueChange={setValue}
          prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
          suffix={
            <Text as="span" variant="small" className="text-muted">
              MSK
            </Text>
          }
        />
        <TimeField.Hint>Each segment is a separate cell inside the shell.</TimeField.Hint>
      </TimeField>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const hours = canvas.getByRole("spinbutton", { name: "hours" });
    await userEvent.click(hours);
    await userEvent.keyboard("{ArrowUp}");
    await expect(hours).toHaveTextContent("15");
  },
};

export const Outline: Story = {
  name: "Outline",
  render: () => (
    <TimeField>
      <TimeField.Label>Outline</TimeField.Label>
      <TimeField.Control
        variant="outline"
        defaultValue="09:00"
        prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
      />
      <TimeField.Hint>Transparent shell background — like Input outline.</TimeField.Hint>
    </TimeField>
  ),
};

export const WithAffixes: Story = {
  name: "Prefix and suffix",
  render: () => (
    <TimeField>
      <TimeField.Label>Duration</TimeField.Label>
      <TimeField.Control
        format="HH:mm:ss"
        defaultValue="01:30:00"
        prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
        suffix={
          <Text as="span" variant="small" className="font-medium text-muted">
            UTC+3
          </Text>
        }
      />
      <TimeField.Hint>Prefix and suffix with separate background and divider.</TimeField.Hint>
    </TimeField>
  ),
};

export const Compact: Story = {
  name: "Compact",
  render: () => (
    <div className="flex flex-col gap-mid">
      <TimeField label="Compact" compact defaultValue="09:30" />
      <TimeField
        compact
        variant="segmented"
        defaultValue="14:15"
        prefix={<IoTimeOutline className="icon-small shrink-0" aria-hidden />}
      />
      <div className="flex flex-wrap items-end gap-small">
        <TimeField compact size="small" defaultValue="08:00" />
        <TimeField compact size="base" defaultValue="09:30" />
        <TimeField compact size="mid" defaultValue="14:15" />
      </div>
    </div>
  ),
};

export const WithSeconds: Story = {
  name: "With seconds",
  render: () => {
    const [value, setValue] = useState("12:30:45");
    return (
      <TimeField
        label="Exact time"
        format="HH:mm:ss"
        value={value}
        onValueChange={setValue}
        prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
      />
    );
  },
};

export const Validation: Story = {
  name: "Validation (hint + error)",
  render: () => (
    <div className="flex w-full flex-col gap-plus">
      <p className="text-sm text-muted">
        Hint — <code className="text-primary">TimeField.Hint</code>; error —{" "}
        <code className="text-primary">TimeField.Error</code> (
        <code className="text-primary">role=&quot;alert&quot;</code>). Both ids are included in{" "}
        <code className="text-primary">aria-describedby</code> on the control.
      </p>
      <ValidatedTimeCompoundDemo />
      <ValidatedTimeSimpleDemo />
    </div>
  ),
};

export const Danger: Story = {
  name: "Danger",
  render: () => (
    <TimeField status="danger">
      <TimeField.Label>Time</TimeField.Label>
      <TimeField.Control defaultValue="25:00" />
      <TimeField.Error>Invalid time.</TimeField.Error>
    </TimeField>
  ),
};

export const Success: Story = {
  render: () => (
    <TimeField status="success">
      <TimeField.Label>Time</TimeField.Label>
      <TimeField.Control defaultValue="09:00" />
      <TimeField.Hint>Saved.</TimeField.Hint>
    </TimeField>
  ),
};

export const Warning: Story = {
  render: () => (
    <TimeField status="warning">
      <TimeField.Label>Time</TimeField.Label>
      <TimeField.Control defaultValue="23:59" />
      <TimeField.Hint>Close to the end of the workday.</TimeField.Hint>
    </TimeField>
  ),
};

export const Required: Story = {
  render: () => (
    <TimeField required>
      <TimeField.Label>Start</TimeField.Label>
      <TimeField.Control defaultValue="09:00" />
    </TimeField>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-plus">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <TimeField key={size} size={size}>
          <TimeField.Label>{size}</TimeField.Label>
          <TimeField.Control
            defaultValue="09:30"
            prefix={<IoTimeOutline className={cnIcon(size)} aria-hidden />}
          />
        </TimeField>
      ))}
    </div>
  ),
};

function cnIcon(size: "small" | "base" | "mid" | "large") {
  return size === "small" ? "icon-small shrink-0" : size === "mid" || size === "large" ? "icon-large shrink-0" : "icon-base shrink-0";
}

export const VariantsComparison: Story = {
  name: "All variants",
  render: () => (
    <div className="flex flex-col gap-mid">
      {(["default", "outline", "segmented"] as const).map((variant) => (
        <TimeField key={variant}>
          <TimeField.Label>{variant}</TimeField.Label>
          <TimeField.Control
            variant={variant}
            defaultValue="09:30"
            prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
          />
        </TimeField>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <TimeField label="Unavailable" defaultValue="09:30" disabled prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />} />
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for TimeField",
      },
    },
  },
  render: () => (
    <TimeField
      className="max-w-sm"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        shell: "ring-1 ring-primary/15",
        segment: "font-semibold",
        prefix: "text-primary",
        hint: "text-foreground/70",
        error: "font-medium",
      }}
      label="Meeting time"
      defaultValue="09:30"
      status="danger"
      hint="24-hour format"
      error="Enter a valid time."
      prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
    />
  ),
};
