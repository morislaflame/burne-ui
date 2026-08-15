import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoStar } from "react-icons/io5";
import gsap from "gsap";

import { DualApiStoryPanel, DualApiStoryPanels } from "@/stories-utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/stories-utils/dualApiStorySource";
import { Label } from "@/components/core/Label";

import { Checkbox } from "./index";
import { CheckboxMotionDemo } from "../../../../playground/showcase/demos/checkbox/CheckboxMotion.demo";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
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
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Checkbox. **Simple** — `label`, `hint` on root; **Compound** — `<Checkbox.Control>` / `<Checkbox.Indicator>` / `<Checkbox.Content>` with `<Checkbox.Label>` or `<Label htmlFor>`.",
      },
    },
  },
  decorators: [...framedDecorator],
  args: {
    label: "Consent to data processing",
    size: "base" as const,
    variant: "default" as const,
    disabled: false,
    status: "default",
  },
  argTypes: {
    size: { control: "select", options: ["small", "base", "mid", "large"] },
    variant: { control: "select", options: ["default", "secondary", "outline"] },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple and Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props on &lt;Checkbox&gt;">
        <Checkbox
          defaultChecked
          label="Email notifications"
          hint="Short option description"
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — Checkbox.Label">
        <Checkbox defaultChecked id="compound-notifications">
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Checkbox.Label>Email notifications</Checkbox.Label>
            <Checkbox.Hint>Short option description</Checkbox.Hint>
          </Checkbox.Content>
        </Checkbox>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const WithLabelHtmlFor: Story = {
  name: "Compound — Label htmlFor",
  render: () => (
    <Checkbox defaultChecked id="default-notifications">
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Content>
        <Label htmlFor="default-notifications">Enable email notifications</Label>
      </Checkbox.Content>
    </Checkbox>
  ),
};

export const Playground: Story = {};

export const ToggleInteraction: Story = {
  name: "Interaction: toggle",
  args: { label: "Consent to data processing" },
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole("checkbox", {
      name: "Consent to data processing",
    });
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex max-w-md flex-col gap-large">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <Checkbox
          key={size}
          size={size}
          defaultChecked={size === "base"}
          label={`Size ${size}`}
          hint="Subtitle in muted"
        />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  name: "Dot variants",
  render: () => (
    <div className="flex max-w-md flex-col gap-large">
      <Checkbox variant="default" defaultChecked label="default" />
      <Checkbox variant="secondary" label="secondary" />
      <Checkbox variant="outline" defaultChecked label="outline (o)" />
    </div>
  ),
};

export const States: Story = {
  name: "States",
  render: () => (
    <div className="flex max-w-md flex-col gap-large">
      <Checkbox label="Regular" hint="Without status" />
      <Checkbox status="danger" label="With error" hint="Subtitle stays muted" />
      <Checkbox disabled label="Disabled" hint="Cannot toggle" />
      <Checkbox disabled defaultChecked label="Disabled, checked" />
    </div>
  ),
};

export const CustomIcon: Story = {
  name: "Custom icon",
  render: () => (
    <Checkbox defaultChecked icon={<IoStar aria-hidden className="size-full" />} label="Favorites" hint="Star instead of checkmark" />
  ),
};

export const CustomIndicator: Story = {
  name: "Compound — custom Indicator",
  render: () => (
    <Checkbox defaultChecked>
      <Checkbox.Control>
        <Checkbox.Indicator>
          <IoStar aria-hidden className="text-primary-foreground -translate-y-[0.5px]" />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Content>
        <Checkbox.Label>Favorites</Checkbox.Label>
        <Checkbox.Hint>Custom icon with the same fill animation as the checkmark</Checkbox.Hint>
      </Checkbox.Content>
    </Checkbox>
  ),
};

export const IndicatorShape: Story = {
  name: "Indicator — shape",
  render: () => (
    <Checkbox defaultChecked size="large">
      <Checkbox.Control>
        <Checkbox.Indicator
          classNames={{
            root: "rounded-mid",
          }}
        />
      </Checkbox.Control>
      <Checkbox.Content>
        <Checkbox.Label>rounded-mid</Checkbox.Label>
        <Checkbox.Hint>Fill follows shell radius automatically.</Checkbox.Hint>
      </Checkbox.Content>
    </Checkbox>
  ),
};

export const IndicatorCompound: Story = {
  name: "Indicator — Fill + Mark",
  render: () => (
    <Checkbox defaultChecked variant="outline">
      <Checkbox.Control>
        <Checkbox.Indicator classNames={{ root: "rounded-mid" }}>
          <Checkbox.Indicator.Fill />
          <Checkbox.Indicator.Mark>
            <IoStar aria-hidden className="text-primary" />
          </Checkbox.Indicator.Mark>
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Content>
        <Checkbox.Label>Compound slots</Checkbox.Label>
        <Checkbox.Hint>Checkbox.Indicator.Fill and Checkbox.Indicator.Mark.</Checkbox.Hint>
      </Checkbox.Content>
    </Checkbox>
  ),
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div className="flex max-w-md flex-col gap-large text-left">
      <p className="text-sm text-muted">
        Simple: native <code className="text-primary">&lt;label&gt;</code> + hidden input. Compound:{" "}
        <code className="text-primary">role=&quot;group&quot;</code>,{" "}
        <code className="text-primary">aria-labelledby</code>, hint and error —{" "}
        <code className="text-primary">aria-describedby</code>.
      </p>
      <Checkbox
        id="a11y-checkbox"
        defaultChecked
        label="Consent"
        hint="Hint linked via aria-describedby"
      />
      <Checkbox
        id="a11y-checkbox-error"
        label="Consent to processing"
        hint="Required for registration"
        error="Accept the terms to continue."
      />
    </div>
  ),
};

function ControlledDemo() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex max-w-md flex-col gap-mid">
      <Checkbox
        checked={on}
        onChange={(e) => setOn(e.target.checked)}
        label="Controlled checkbox"
        hint={`Currently: ${on ? "on" : "off"}`}
      />
    </div>
  );
}

export const Controlled: Story = {
  name: "Controlled",
  render: () => <ControlledDemo />,
};

export const OnLightTheme: Story = {
  name: "Light theme",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex max-w-md flex-col gap-large">
      <Checkbox defaultChecked label="Light theme" hint="primary / primary-foreground" />
      <Checkbox variant="outline" label="Outline" />
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Checkbox (compound API)",
      },
    },
  },
  render: () => (
    <Checkbox
      defaultChecked
      variant="outline"
      classNames={{
        root: "rounded-large border-primary/40 bg-primary/5 p-large shadow-token-mid",
        control: "ring-primary/30",
        controlTrack: "border-primary/50",
        indicator: "rounded-mid",
        labelText: "text-primary font-semibold",
        hint: "text-foreground/80",
      }}
    >
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Content>
        <Checkbox.Label>Newsletter consent</Checkbox.Label>
        <Checkbox.Hint>All slots configured via classNames.</Checkbox.Hint>
      </Checkbox.Content>
    </Checkbox>
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
    <Checkbox
      defaultChecked
      label="Email newsletter"
      hint="classNames.label and labelText in simple API."
      classNames={{
        label: "text-primary",
        labelText: "font-semibold underline decoration-primary/30 underline-offset-4",
        hint: "text-muted/80",
      }}
      className="max-w-md"
    />
  ),
};

const FILL_CORNER = "top right";

function fillFromTopRightCheck(el: HTMLElement) {
  return gsap.fromTo(
    el,
    { scale: 0, autoAlpha: 0, transformOrigin: FILL_CORNER },
    {
      scale: 1,
      autoAlpha: 1,
      duration: 0.4,
      ease: "power3.out",
      transformOrigin: FILL_CORNER,
      overwrite: "auto",
      force3D: false,
    },
  );
}

function fillFromTopRightUncheck(el: HTMLElement) {
  return gsap.to(el, {
    scale: 0,
    autoAlpha: 0,
    duration: 0.22,
    ease: "power2.in",
    transformOrigin: FILL_CORNER,
    overwrite: "auto",
    force3D: false,
  });
}

export const SlotMotion: Story = {
  name: "Slot motion",
  ...dualApiStorySource,
  parameters: {
    docs: {
      description: {
        story:
          "Simple: `motion.indicatorFill` on the root. Compound: `motion` on `Checkbox.Indicator.Fill`. Fill grows in from the top-right corner.",
      },
    },
  },
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — motion map on &lt;Checkbox&gt;">
        <Checkbox
          defaultChecked
          label="Custom fill"
          hint="Fill grows in from the top-right corner."
          motion={{
            indicatorFill: {
              check: (ctx) => fillFromTopRightCheck(ctx.el),
              uncheck: (ctx) => fillFromTopRightUncheck(ctx.el),
            },
          }}
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — motion on Fill">
        <Checkbox defaultChecked>
          <Checkbox.Control>
            <Checkbox.Indicator>
              <Checkbox.Indicator.Fill
                motion={{
                  check: (ctx) => fillFromTopRightCheck(ctx.el),
                  uncheck: (ctx) => fillFromTopRightUncheck(ctx.el),
                }}
              />
              <Checkbox.Indicator.Mark />
            </Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.Content>
            <Checkbox.Label>Custom fill</Checkbox.Label>
            <Checkbox.Hint>motion on Checkbox.Indicator.Fill — same corner origin.</Checkbox.Hint>
          </Checkbox.Content>
        </Checkbox>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery (color, parts, timeline)",
  render: () => <CheckboxMotionDemo />,
};
