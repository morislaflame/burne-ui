import type { ComponentType, ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen } from "storybook/test";
import { IoHelpCircleOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";

import { Tooltip, type TooltipVariant } from ".";

const VARIANTS: TooltipVariant[] = [
  "default",
  "outline",
  "secondary",
];

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

/** Page background and `data-theme="light"`, like `Alert.stories` («Variants (light theme)»). */
const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border w-full p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Tooltip on **hover** and **focus**. Compound: `<Tooltip.Trigger>` + `<Tooltip.Content>`; optional `<Tooltip.Arrow />`. With a single trigger child, handlers and `aria-describedby` are forwarded to it.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

const TOOLTIP_VARIANT_ITEMS: Array<{
  variant?: TooltipVariant;
  status?: "danger" | "success" | "info" | "warning";
  title: string;
  description?: string;
  icon?: ReactNode;
  showIcon?: boolean;
}> = [
  {
    variant: "default",
    title: "Default",
    description: "Neutral tooltip without a status icon.",
  },
  {
    variant: "outline",
    title: "Outline",
    description: "Semi-transparent background with border.",
  },
  {
    variant: "secondary",
    title: "Secondary",
    description: "Same background as secondary components.",
  },
  {
    status: "success",
    title: "Profile updated successfully",
    description: "Changes saved and synced.",
  },
  {
    status: "danger",
    title: "Unable to connect to server",
    description: "We're experiencing connection issues.",
  },
  {
    status: "info",
    title: "Help",
    description: "Additional information in a neutral informational tone.",
  },
  {
    status: "warning",
    title: "Scheduled maintenance",
    description: "Services will be unavailable Sunday from 2:00 AM to 6:00 AM UTC.",
  },
  {
    variant: "default",
    title: "Custom icon",
    description: "Icon via the `icon` prop on Panel.",
    icon: <IoHelpCircleOutline aria-hidden className="text-primary" />,
  },
  {
    status: "danger",
    title: "Semantic without icon",
    description: "showIcon={false} disables the default icon.",
    showIcon: false,
  },
  {
    status: "success",
    title: "Title only",
  },
];

function TooltipVariantsDemo() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-plus">
      {TOOLTIP_VARIANT_ITEMS.map((item) => (
        <Tooltip.Panel
          key={`${item.variant}-${item.title}`}
          variant={item.variant}
          status={item.status}
          size="base"
          title={item.title}
          description={item.description}
          icon={item.icon}
          showIcon={item.showIcon}
        />
      ))}
    </div>
  );
}

export const Variants: Story = {
  name: "Variants",
  render: () => <TooltipVariantsDemo />,
};

export const OnButtonSizes: Story = {
  name: "Sizes on button",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-mid">
      <Tooltip size="small" variant="default">
        <Tooltip.Trigger>
          <Button size="small" variant="outline" type="button">
            Hover (small)
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Compact tooltip</Tooltip.Content>
      </Tooltip>
      <Tooltip size="base" variant="default">
        <Tooltip.Trigger>
          <Button size="base" variant="outline" type="button">
            Hover (base)
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Standard tooltip size</Tooltip.Content>
      </Tooltip>
      <Tooltip size="mid" variant="default">
        <Tooltip.Trigger>
          <Button size="mid" variant="outline" type="button">
            Hover (mid)
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Medium tooltip size</Tooltip.Content>
      </Tooltip>
      <Tooltip size="large" variant="default">
        <Tooltip.Trigger>
          <Button size="large" variant="outline" type="button">
            Hover (large)
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Wider padding for a long tooltip</Tooltip.Content>
      </Tooltip>
    </div>
  ),
};

function SemanticVariantsDemo() {
  return (
    <div className="flex min-h-[14rem] max-w-xl flex-row flex-wrap items-center justify-center gap-mid py-xlarge">
      {VARIANTS.map((variant) => (
        <Tooltip key={variant} variant={variant}>
          <Tooltip.Trigger>
            <Button variant="ghost" type="button" className="capitalize">
              {variant}
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>{`Variant «${variant}»`}</Tooltip.Content>
        </Tooltip>
      ))}
    </div>
  );
}

export const SemanticVariants: Story = {
  name: "Variants like Alert — semantic (dark theme)",
  render: () => <SemanticVariantsDemo />,
};

export const SemanticVariantsOnLightTheme: Story = {
  name: "Variants like Alert — semantic (light theme)",
  decorators: [...lightThemeDecorator],
  render: () => <SemanticVariantsDemo />,
};

export const DefaultWithOptionalIcon: Story = {
  name: "Optional icon on default",
  render: () => (
    <Tooltip
      variant="default"
      icon={<IoHelpCircleOutline aria-hidden className="text-primary" />}
    >
      <Tooltip.Trigger>
        <Button size="large" variant="outline" type="button">
          Hover
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Custom icon only via prop `icon`</Tooltip.Content>
    </Tooltip>
  ),
};

export const SemanticIconHidden: Story = {
  name: "Semantic without icon",
  render: () => (
    <Tooltip status="danger" showIcon={false}>
      <Tooltip.Trigger>
        <Button size="large" variant="outline" type="button">
          Hover
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Without default icon</Tooltip.Content>
    </Tooltip>
  ),
};

export const WithArrow: Story = {
  name: "With arrow",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-mid">
      <Tooltip delayShowMs={0} side="top">
        <Tooltip.Trigger>
          <Button variant="secondary" type="button">
            With arrow
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content showArrow>
          <Tooltip.Arrow />
          Tooltip with arrow on top
        </Tooltip.Content>
      </Tooltip>
      <Tooltip delayShowMs={0} side="bottom">
        <Tooltip.Trigger>
          <Button variant="outline" type="button">
            Bottom
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content showArrow>
          <Tooltip.Arrow />
          Tooltip below
        </Tooltip.Content>
      </Tooltip>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole("button", { name: "With arrow" }));
    await expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip with arrow on top");
  },
};

export const CustomOffset: Story = {
  name: "Custom offset",
  render: () => (
    <Tooltip delayShowMs={0} side="top">
      <Tooltip.Trigger>
        <Button variant="primary" type="button">
          offset=12
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content showArrow offset={12}>
        <Tooltip.Arrow />
        Larger offset from trigger
      </Tooltip.Content>
    </Tooltip>
  ),
};

export const Placements: Story = {
  name: "Placement (4 sides)",
  render: () => (
    <div className="grid grid-cols-2 gap-xlarge py-xlarge">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <div key={side} className="flex items-center justify-center">
          <Tooltip delayShowMs={0} side={side}>
            <Tooltip.Trigger>
              <Button variant="outline" type="button" className="capitalize">
                {side}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content showArrow>
              <Tooltip.Arrow />
              {`Tooltip ${side}`}
            </Tooltip.Content>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};

export const KeyboardFocus: Story = {
  name: "Focus (keyboard)",
  render: () => (
    <Tooltip delayShowMs={0}>
      <Tooltip.Trigger>
        <Button variant="outline" type="button">
          Tab here
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Tooltip on focus and hover</Tooltip.Content>
    </Tooltip>
  ),
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Content: <code className="text-primary">role=&quot;tooltip&quot;</code>. Link to trigger —{" "}
        <code className="text-primary">aria-describedby</code> only while the tooltip is open. Hover and
        focus; <kbd className="rounded-small border-token px-xsmall py-0.5 text-xsmall">Escape</kbd>{" "}
        closes. A single <code className="text-primary">Trigger</code> child receives handlers without
        an extra tab stop.
      </p>
      <Tooltip delayShowMs={0}>
        <Tooltip.Trigger>
          <Button variant="outline" type="button">
            Button with tooltip
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Additional description for AT</Tooltip.Content>
      </Tooltip>
      <Tooltip delayShowMs={0} status="info">
        <Tooltip.Trigger>
          <Button variant="ghost" type="button" aria-label="Field help">
            ?
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Trigger without visible label — set aria-label</Tooltip.Content>
      </Tooltip>
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story:
          "Slots root (trigger), trigger, content, arrow, panel, glossPanel, glossContent, message, icon, indicator, title, and description via classNames prop on root.",
      },
    },
  },
  render: () => (
    <Tooltip
      delayShowMs={0}
      status="info"
      classNames={{
        root: "rounded-mid ring-2 ring-primary/35",
        trigger: "rounded-mid",
        content: "ring-1 ring-primary/25",
        panel: "border-primary/30",
        glossPanel: "ring-1 ring-primary/20",
        title: "text-primary font-semibold",
        description: "text-muted/80",
      }}
    >
      <Tooltip.Trigger>
        <Button variant="outline" type="button">
          Custom slots
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content showArrow>
        <Tooltip.Arrow />
        <Tooltip.Icon />
        <Tooltip.Title>Title</Tooltip.Title>
        <Tooltip.Description>Description with custom classes</Tooltip.Description>
      </Tooltip.Content>
    </Tooltip>
  ),
};

// ─── portalContainer (3.1) ────────────────────────────────────────────────────

export const PortalContainer: Story = {
  name: "portalContainer",
  parameters: {
    docs: {
      description: {
        story:
          "`portalContainer` mounts the tooltip into a custom host instead of `document.body`.",
      },
    },
  },
  render: function PortalContainerDemo() {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    return (
      <div className="flex w-full max-w-lg flex-col gap-mid">
        <p className="text-sm text-muted">
          Tooltip portals into the box below (not <code className="text-foreground">document.body</code>).
        </p>
        <div
          ref={setContainer}
          className="relative flex h-48 items-center justify-center overflow-hidden rounded-mid border-2 border-dashed border-primary/40 bg-surface/40 p-mid"
          style={{ transform: "translateZ(0)" }}
        >
          <p className="absolute left-mid top-mid text-xs text-muted">Custom portal host</p>
          {container ? (
            <Tooltip delayShowMs={0} portalContainer={container}>
              <Tooltip.Trigger>
                <Button variant="outline" type="button">
                  Hover in host
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <Tooltip.Title>Inside host</Tooltip.Title>
                <Tooltip.Description>Portaled into the dashed container.</Tooltip.Description>
              </Tooltip.Content>
            </Tooltip>
          ) : null}
        </div>
      </div>
    );
  },
};

// ─── asChild merged props (3.3) ───────────────────────────────────────────────

export const AsChildMergedProps: Story = {
  name: "asChild — merged props & ref",
  parameters: {
    docs: {
      description: {
        story:
          "`Tooltip.Trigger` (default `asChild`) merges host `id`, `data-*`, `className`, and `ref` onto the child via `mergeAsChildProps`.",
      },
    },
  },
  render: function AsChildMergedPropsDemo() {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [refLabel, setRefLabel] = useState("ref: —");

    useLayoutEffect(() => {
      const node = triggerRef.current;
      setRefLabel(node ? `ref → #${node.id} (${node.tagName.toLowerCase()})` : "ref: —");
    }, []);

    return (
      <div className="flex flex-col items-center gap-mid">
        <p className="text-sm text-muted">{refLabel}</p>
        <Tooltip delayShowMs={0}>
          <Tooltip.Trigger
            ref={triggerRef}
            id="story-tooltip-trigger"
            data-testid="story-tooltip-trigger"
            data-analytics="hover-tooltip"
            className="ring-2 ring-primary/30"
          >
            <Button variant="outline" type="button">
              Hover (merged props)
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Title>Merged trigger</Tooltip.Title>
            <Tooltip.Description>
              Host props from Trigger land on the Button child.
            </Tooltip.Description>
          </Tooltip.Content>
        </Tooltip>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const btn = canvas.getByTestId("story-tooltip-trigger");
    await expect(btn).toHaveAttribute("id", "story-tooltip-trigger");
    await expect(btn).toHaveAttribute("data-analytics", "hover-tooltip");
  },
};

export const GlossWithCompoundLayout: Story = {
  name: "Gloss — grid like Alert",
  render: () => (
    <Tooltip delayShowMs={0} variant="gloss" status="info">
      <Tooltip.Trigger>
        <Button variant="gloss" type="button">
          Gloss compound
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content showArrow>
        <Tooltip.Arrow />
        <Tooltip.Icon />
        <Tooltip.Title>Help</Tooltip.Title>
        <Tooltip.Description>Icon to the left of title and description</Tooltip.Description>
      </Tooltip.Content>
    </Tooltip>
  ),
};

export const CompoundCustomIcon: Story = {
  name: "Compound — custom icon",
  render: () => (
    <Tooltip delayShowMs={0} variant="default">
      <Tooltip.Trigger>
        <Button variant="outline" type="button">
          Custom icon
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Tooltip.Icon>
          <IoHelpCircleOutline aria-hidden className="text-primary" />
        </Tooltip.Icon>
        <Tooltip.Title>Hint</Tooltip.Title>
        <Tooltip.Description>Icon is set via Tooltip.Icon in compound API</Tooltip.Description>
      </Tooltip.Content>
    </Tooltip>
  ),
};
