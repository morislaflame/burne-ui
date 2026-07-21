import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoBookmarkOutline, IoCheckmarkCircleOutline, IoHeartOutline, IoMoonOutline, IoNotificationsOutline, IoRocketOutline } from "react-icons/io5";

import { DualApiStoryPanel, DualApiStoryPanels } from "@/stories-utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/stories-utils/dualApiStorySource";

import { Avatar } from "@/components/core/Avatar";
import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { Badge, type BadgePlacement, type BadgeStatus, type BadgeVariant } from ".";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3 } from "@/stories-utils/mockImages";
import { glossDottedDecorator } from "@/stories-utils/glossStoryChrome";

const GREEN_AVATAR_URL = PIN_IMAGE1;
const ORANGE_AVATAR_URL = PIN_IMAGE2;
const BLUE_AVATAR_URL = PIN_IMAGE3;

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

/** Like `Alert.stories` — light theme and `var(--color-background)` background. */
const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const BADGE_VARIANTS: BadgeVariant[] = [
  "default",
  "primary",
  "outline",
  "secondary",
  "gloss",
];

const BADGE_STATUSES: BadgeStatus[] = [
  "default",
  "danger",
  "success",
  "info",
  "warning",
];

const CORNER_LABELS = [
  ["top-right", "top-right"],
  ["top-left", "top-left"],
  ["bottom-right", "bottom-right"],
  ["bottom-left", "bottom-left"],
] satisfies [BadgePlacement, string][];

const meta = {
  title: "Core Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Compact status badge. **Simple** — `icon` + text in `children`; **inline icons** — `data-icon=\"inline-start\" | \"inline-end\"` on child. `variant=\"gloss\"` — glass surface. For overlay — `Badge.Anchor`. Slots are configured via `classNames` (`root`, `text`, `iconOnly`, `dot`, `anchor`).",
      },
    },
  },
  decorators: [...framedDecorator],
  argTypes: {
    color: {
      control: "select",
      options: [...BADGE_VARIANTS, ...BADGE_STATUSES.filter((s) => s !== "default")],
    },
    variant: {
      control: "select",
      options: BADGE_VARIANTS,
    },
    status: {
      control: "select",
      options: BADGE_STATUSES,
    },
    size: {
      control: "select",
      options: ["small", "base", "mid", "large"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

function SizesAndVariantsDemo() {
  return (
    <div className="flex flex-col gap-xlarge py-mid">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-base">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            {size}
          </span>
          <div className="flex flex-wrap items-center gap-base">
            {BADGE_VARIANTS.map((variant) => (
              <Badge key={variant} size={size} variant={variant} className="capitalize">
                {variant}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const SizesAndVariants: Story = {
  name: "Sizes and variants (dark theme)",
  render: () => <SizesAndVariantsDemo />,
};

export const SizesAndVariantsOnLightTheme: Story = {
  name: "Sizes and variants (light theme)",
  decorators: [...lightThemeDecorator],
  render: () => <SizesAndVariantsDemo />,
};

function StatusVariantsDemo() {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-xlarge py-mid">
      {BADGE_STATUSES.map((status) => (
        <div key={status} className="flex flex-col gap-base">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            status: {status}
          </span>
          <div className="flex flex-wrap items-center gap-base">
            {BADGE_VARIANTS.map((variant) => (
              <Badge
                key={`${status}-${variant}`}
                variant={variant}
                status={status}
                className="capitalize"
              >
                {variant}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const StatusVariants: Story = {
  name: "Statuses × variants (dark theme)",
  render: () => <StatusVariantsDemo />,
};

export const StatusVariantsOnLightTheme: Story = {
  name: "Statuses × variants (light theme)",
  decorators: [...lightThemeDecorator],
  render: () => <StatusVariantsDemo />,
};

export const BadgeAnchorComposition: Story = {
  name: "Badge.Anchor + Avatar (as in API)",
  render: () => (
    <div className="flex flex-col gap-xlarge">
      <p className="max-w-xl text-center text-sm text-muted">
        Hover the avatar: the badge scales up slightly (like&nbsp;
        <code className="text-primary">Button</code>).
      </p>
      <div className="flex flex-wrap items-start justify-center gap-xlarge">
        <Badge.Anchor>
          <Avatar size="large" label="Jordan Doe" src={GREEN_AVATAR_URL} alt="" loading="lazy" />
          <Badge status="danger" size="small">
            5
          </Badge>
        </Badge.Anchor>

        <Badge.Anchor>
          <Avatar size="large" label="Alex Brown" src={ORANGE_AVATAR_URL} alt="" loading="lazy" />
          <Badge variant="secondary" size="small">
            New
          </Badge>
        </Badge.Anchor>

        <Badge.Anchor>
          <Avatar size="large" label="Casey Davis" src={BLUE_AVATAR_URL} alt="" loading="lazy" />
          <Badge
            status="success"
            dot
            // placement="bottom-right"
            size="small"
            aria-label="Active"
          />
        </Badge.Anchor>
      </div>
    </div>
  ),
};

export const IconInlineChildren: Story = {
  name: "Inline icons (data-icon)",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Compound — data-icon on child">
        <div className="flex flex-wrap gap-small">
          <Badge variant="secondary">
            <IoCheckmarkCircleOutline data-icon="inline-start" />
            Verified
          </Badge>
          <Badge variant="outline">
            Bookmark
            <IoBookmarkOutline data-icon="inline-end" />
          </Badge>
        </div>
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Simple — prop icon + iconPosition">
        <div className="flex flex-wrap gap-small">
          <Badge
            status="info"
            size="base"
            icon={<IoRocketOutline aria-hidden />}
            iconPosition="start"
          >
            Start
          </Badge>
          <Badge
            status="success"
            size="base"
            icon={<IoRocketOutline aria-hidden />}
            iconPosition="end"
          >
            End
          </Badge>
        </div>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const VisibilityInteraction: Story = {
  name: "Interaction: visibility",
  render: () => (
    <Badge variant="secondary">
      <IoCheckmarkCircleOutline data-icon="inline-start" />
      Verified
    </Badge>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Verified")).toBeVisible();
  },
};

export const IconStartEnd: Story = {
  name: "Simple: icon + iconPosition",
  render: () => (
    <div className="flex flex-col items-start gap-mid">
      <p className="text-sm text-muted">
        Prop <code className="text-primary">icon</code> +{" "}
        <code className="text-primary">iconPosition</code> — root gets{" "}
        <code className="text-primary">data-icon=&quot;start&quot;</code> /{" "}
        <code className="text-primary">end</code>.
      </p>
      <div className="flex flex-wrap items-center gap-plus">
        <Badge
          status="info"
          size="base"
          icon={<IoRocketOutline aria-hidden />}
          iconPosition="start"
        >
          Start
        </Badge>
        <Badge
          status="success"
          size="base"
          icon={<IoRocketOutline aria-hidden />}
          iconPosition="end"
        >
          End
        </Badge>
      </div>
    </div>
  ),
};

export const IconOnly: Story = {
  name: "Icon only",
  render: () => (
    <div className="flex flex-wrap items-center gap-mid">
      <Badge status="danger" icon={<IoHeartOutline aria-hidden />} aria-label="Favorites" />
      <Badge variant="secondary" iconOnly icon={<IoMoonOutline aria-hidden />} aria-label="Secondary" />
      <Badge status="warning" size="small" icon={<IoNotificationsOutline aria-hidden />} aria-label="Notifications" />
    </div>
  ),
};

function DotsVariantsDemo() {
  return (
    <div className="flex flex-col gap-mid py-mid">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-xlarge">
          {BADGE_STATUSES.map((status) => (
            <div key={status} className="flex flex-col items-center gap-xsmall">
              <Badge status={status} dot size={size} aria-label={`${status}`} />
              <span className="max-w-[4.5rem] text-center text-xs capitalize text-muted">
                {status}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export const DotsVariants: Story = {
  name: "Dot only (dark theme)",
  render: () => <DotsVariantsDemo />,
};

export const DotsVariantsOnLightTheme: Story = {
  name: "Dot only (light theme)",
  decorators: [...lightThemeDecorator],
  render: () => <DotsVariantsDemo />,
};

export const CornersViaAnchorPlacement: Story = {
  name: "Corners via Badge.Anchor placement",
  render: () => (
    <div className="flex flex-col gap-mid">
      <p className="max-w-lg text-sm text-muted">
        Inside the anchor, badge defaults to <code>top-right</code>; corner is set via prop{" "}
        <code>placement</code>.
      </p>
      <div className="grid grid-cols-2 gap-xlarge sm:grid-cols-4">
        {CORNER_LABELS.map(([placement, label]) => (
          <div key={placement} className="flex flex-col items-center gap-base">
            <Badge.Anchor className="box-border h-24 w-24 rounded-2xl border-token border-dashed bg-surface/40 shadow-none">
              <Badge variant="primary" status="danger" size="base" placement={placement}>
                3
              </Badge>
            </Badge.Anchor>
            <span className="text-xs text-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const WithCard: Story = {
  name: "With Card",
  render: () => (
    <div className="flex w-full max-w-md justify-center">
      <Badge.Anchor className="relative w-full max-w-none shrink-0">
        <Card className="w-full overflow-hidden">
          <Card.Header>
            <Card.Title>Release 0.12</Card.Title>
            <Card.Description>
              Badge support, notifications, and counters on product interfaces.
            </Card.Description>
          </Card.Header>
          <Card.Footer className="flex flex-wrap items-center gap-plus">
            <Badge status="success" size="small" icon={<IoCheckmarkCircleOutline aria-hidden />}>
              Done
            </Badge>
            <Badge status="warning" size="small" iconPosition="end" icon={<IoRocketOutline aria-hidden />}>
              Beta
            </Badge>
            <Button type="button" size="base" variant="outline">
              Details
            </Button>
          </Card.Footer>
        </Card>
        <Badge variant="outline" size="small" aria-label="New on map" dot />
      </Badge.Anchor>
    </div>
  ),
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div className="flex max-w-lg flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Text badge is read as a label; inline icons are decorative (
        <code className="text-primary">aria-hidden</code>). Icon-only and dot without label require{" "}
        <code className="text-primary">aria-label</code>.
      </p>
      <div className="flex flex-wrap items-center gap-plus">
        <Badge status="success">
          <IoCheckmarkCircleOutline data-icon="inline-start" />
          Published
        </Badge>
        <Badge
          status="danger"
          icon={<IoHeartOutline aria-hidden />}
          aria-label="Favorites"
        />
        <Badge dot status="info" aria-label="Updates available" />
      </div>
    </div>
  ),
};

export const CustomColors: Story = {
  name: "Custom badges",
  render: () => (
    <div className="flex flex-col gap-xlarge">
      <div className="flex flex-col gap-base">
        <div className="flex flex-wrap items-center gap-plus">
          <Badge
            size="base"
            className="border-transparent bg-[oklch(58%_0.24_300)] text-white shadow-base"
          >
            OKLCH purple
          </Badge>
          <Badge
            size="base"
            className="border-0 bg-[linear-gradient(90deg,#0891b2_0%,#0891b2_12%,#1d4ed8_88%,#1d4ed8_100%)] bg-no-repeat text-white shadow-base [background-size:100%_100%]"
          >
            Gradient
          </Badge>
          <Badge
            size="base"
            className="border-amber-600/50 bg-amber-400 text-amber-950 shadow-none dark:border-amber-500/40 dark:bg-amber-300 dark:text-amber-950"
          >
            Amber · light/dark
          </Badge>
          <Badge
            size="base"
            icon={<IoRocketOutline aria-hidden />}
            iconPosition="start"
            className="border-transparent bg-rose-600 text-white shadow-none [&_svg]:text-white"
          >
            Icon + custom
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-base">
        <div className="flex flex-wrap items-center gap-xlarge">
          <Badge
            dot
            size="base"
            aria-label="Custom violet dot"
            className="border-0 bg-[oklch(55%_0.2_280)] ring-2 ring-background motion-reduce:ring-1"
          />
          <Badge
            dot
            size="base"
            aria-label="Custom lime dot"
            className="border-0 bg-lime-500 ring-2 ring-background motion-reduce:ring-1 dark:bg-lime-400"
          />
          <Badge.Anchor className="rounded-full">
            <Avatar size="base" label="Demo" />
            <Badge
              size="small"
              placement="top-right"
              className="border-transparent bg-fuchsia-600 text-white shadow-none"
            >
              9+
            </Badge>
          </Badge.Anchor>
          <span className="text-xs text-muted">
            Anchor + badge with arbitrary colors
          </span>
        </div>
      </div>
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story:
          "classNames customization for Badge",
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-center gap-xlarge">
      <Badge
        status="info"
        classNames={{
          root: "rounded-large",
          text: "border-info/50 bg-info/10 text-info",
        }}
      >
        Global text style
      </Badge>
      <Badge
        iconOnly
        icon={<IoRocketOutline aria-hidden />}
        aria-label="icon-only slot"
        classNames={{
          root: "rounded-large",
          iconOnly: "border-success/40 bg-success/10 text-success",
        }}
      />
      <Badge.Anchor
        classNames={{
          anchor: "rounded-full ring-2 ring-primary/30",
          root: "rounded-full",
          dot: "ring-2 ring-background border-0 bg-success",
        }}
      >
        <Avatar size="base" label="Demo" />
        <Badge dot status="success" aria-label="Online" />
      </Badge.Anchor>
    </div>
  ),
};

function GlossDemo() {
  return (
    <div className="flex flex-col items-center gap-xlarge">
      <div className="flex flex-wrap items-center justify-center gap-plus">
        <Badge variant="gloss">Gloss</Badge>
        {BADGE_STATUSES.filter((s) => s !== "default").map((status) => (
          <Badge key={status} variant="gloss" status={status} className="capitalize">
            {status}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-plus">
        <Badge variant="gloss" icon={<IoCheckmarkCircleOutline aria-hidden />}>
          Verified
        </Badge>
        <Badge variant="gloss" status="info" icon={<IoRocketOutline aria-hidden />}>
          Launch
        </Badge>
        <Badge variant="gloss" dot status="success" aria-label="Online" />
      </div>
      <Badge.Anchor>
        <Avatar size="large" label="Jordan Doe" src={GREEN_AVATAR_URL} alt="" loading="lazy" />
        <Badge variant="gloss" status="danger" size="small">
          5
        </Badge>
      </Badge.Anchor>
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
