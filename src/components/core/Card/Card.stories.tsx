import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { useCallback, useState } from "react";

import { Form, type FormValues } from "@/components/composite/Form";
import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button/Button";
import { Input } from "@/components/core/Input";
import { Ripple } from "@/components/core/Ripple";
import { Separator } from "@/components/core/Separator";
import { Text } from "@/components/core/Text";
import { Card, type CardVariant } from ".";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3, PIN_IMAGE4 } from "@/utils/mockImages";
import { IoArrowForward, IoTimeOutline } from "react-icons/io5";

const CARD_RIPPLE_COLOR: Record<CardVariant, "neutral"> = {
  default: "neutral",
  outline: "neutral",
  secondary: "neutral",
  gloss: "neutral",
};

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="w-full max-w-md">
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
      <div className="w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

/** Wide area for grids and horizontal layouts. */
const wideDarkDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="w-full max-w-6xl px-small">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    pressable: {
      control: "boolean",
      description:
        "Hover-lift + shadow and squeeze on press; role=\"button\", activated with Enter/Space. Ripple — separately (`<Ripple />` as first child inside the card + content in `z-[1]`).",
    },
    onPress: { action: "press" },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <Card.Header>
        <Card.Title>Card title</Card.Title>
        <Card.Description>
          Short description or subtitle in secondary color.
        </Card.Description>
      </Card.Header>
    </Card>
  ),
};

export const WithFooter: Story = {
  name: "With footer",
  render: () => (
    <Card>
      <Card.Header>
        <Card.Title>Document</Card.Title>
        <Card.Description>Updated May 10, 2026</Card.Description>
      </Card.Header>
      <Card.Footer className="flex items-center justify-end gap-base">
        <Button variant="ghost" size="base" ripple>
          Cancel
        </Button>
        <Button variant="primary" size="base" ripple>
          Open
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const Outline: Story = {
  name: "Outline",
  render: () => (
    <Card variant="outline">
      <Card.Header>
        <Card.Title>Transparent fill</Card.Title>
        <Card.Description>Border only — like a secondary block.</Card.Description>
      </Card.Header>
    </Card>
  ),
};

export const Secondary: Story = {
  name: "Secondary",
  render: () => (
    <Card variant="secondary">
      <Card.Header>
        <Card.Title>Secondary surface</Card.Title>
        <Card.Description>Same style as Alert/Badge secondary.</Card.Description>
      </Card.Header>
    </Card>
  ),
};

export const Pressable: Story = {
  name: "Pressable",
  render: function PressableDemo() {
    const [n, setN] = useState(0);
    return (
      <div className="flex flex-col gap-mid">
        <p className="text-center text-small tabular-nums text-muted" aria-live="polite">
          Presses (any card below): {n}
        </p>
        <Card pressable onPress={() => setN((c) => c + 1)}>
          <Ripple color={CARD_RIPPLE_COLOR.default} direction="out"/>
          <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
            <Card.Header>
              <Card.Title>Card button</Card.Title>
              <Card.Description>
                Hover — lift and shadow; click — squeeze and onPress; ripple is set with{" "}
                <code className="text-xs">&lt;Ripple /&gt;</code> outside.
              </Card.Description>
            </Card.Header>
          </div>
        </Card>
        <Card variant="outline" pressable onPress={() => setN((c) => c + 1)}>
          <Ripple color={CARD_RIPPLE_COLOR.outline} direction="out"/>
          <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
            <Card.Header>
              <Card.Title>Outline + pressable</Card.Title>
              <Card.Description>Same pattern, glass border.</Card.Description>
            </Card.Header>
          </div>
        </Card>
        <Card variant="secondary" pressable onPress={() => setN((c) => c + 1)}>
          <Ripple color={CARD_RIPPLE_COLOR.secondary} direction="out"/>
          <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
            <Card.Header>
              <Card.Title>Secondary + pressable</Card.Title>
              <Card.Description>Ripple tone for secondary surface.</Card.Description>
            </Card.Header>
          </div>
        </Card>
      </div>
    );
  },
};

export const PressInteraction: Story = {
  name: "Interaction: press",
  render: function PressInteractionDemo() {
    const [n, setN] = useState(0);
    return (
      <div className="flex flex-col gap-mid">
        <p className="text-center text-small tabular-nums text-muted" aria-live="polite">
          Presses: {n}
        </p>
        <Card pressable onPress={() => setN((c) => c + 1)}>
          <Ripple color={CARD_RIPPLE_COLOR.default} direction="out" />
          <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
            <Card.Header>
              <Card.Title>Card button</Card.Title>
            </Card.Header>
          </div>
        </Card>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /Card button/ }));
    await expect(canvas.getByText("Presses: 1")).toBeInTheDocument();
  },
};

export const PressableWithNestedCard: Story = {
  name: "Pressable with nested card",
  render: function PressableNestedDemo() {
    const [n, setN] = useState(0);
    return (
      <div className="flex flex-col gap-mid">
        <p className="text-center text-small tabular-nums text-muted" aria-live="polite">
          Presses on outer card: {n}
        </p>
        <Card pressable onPress={() => setN((c) => c + 1)}>
          <Ripple color={CARD_RIPPLE_COLOR.default} direction="out"/>
          <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
            <Card.Header>
              <Card.Title>Outer pressable</Card.Title>
              <Card.Description>
                Clicking outside the inner card increments the counter above. The inner card is
                static — text only.
              </Card.Description>
            </Card.Header>
            <Card.Body>
              <Card className="mt-plus">
                <p className="px-mid py-plus text-base leading-normal text-foreground">
                  Nested plain card without title or description — only this paragraph to
                  verify nested surface and spacing.
                </p>
              </Card>
            </Card.Body>
          </div>
        </Card>
      </div>
    );
  },
};

export const WithImageBody: Story = {
  name: "With image in body",
  render: () => (
    <Card>
      <Card.Header>
        <Card.Title>Progress is a mindset</Card.Title>
        <Card.Description>
          Editorial frame in the card body (as in the Expandable example).
        </Card.Description>
      </Card.Header>
      <Card.Body className="px-0 pb-0 pt-base">
        <img
          src={PIN_IMAGE1}
          alt="Portrait in glossy red helmet, text on visor"
          className="max-h-[min(380px,48vh)] w-full object-cover"
          loading="lazy"
        />
      </Card.Body>
    </Card>
  ),
};

function QuickSubscribeCard() {
  const onSubmit = useCallback((values: FormValues) => {
    void values;
  }, []);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Subscription</Card.Title>
        <Card.Description>
          Short form inside Card.Body with the Form component.
        </Card.Description>
      </Card.Header>
      <Card.Body className="border-t-token pt-mid">
        <Form onSubmit={onSubmit} aria-label="Newsletter subscription">
          <Form.Section>
            <Input>
              <Input.Label>Email</Input.Label>
              <Input.Control
                name="email"
                inputType="text"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Input>
          </Form.Section>
          <Button type="submit" variant="primary" size="mid" className="w-full" ripple>
            Subscribe
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export const WithFormBody: Story = {
  name: "With form in body",
  render: () => <QuickSubscribeCard />,
};

/** Full-bleed cover, text and actions below — custom block order. */
export const ImageCoverOnTop: Story = {
  name: "Cover on top (full bleed)",
  render: () => (
    <Card className="max-w-lg overflow-hidden">
      <div className="relative aspect-[16/10] w-full shrink-0 bg-muted">
        <img
          src={PIN_IMAGE2}
          alt="Abstract portrait in warm tones"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <Card.Header>
        <div className="flex flex-wrap items-center gap-xsmall">
          <Badge status="info" size="small">
            Editorial
          </Badge>
          <span className="inline-flex items-center gap-xsmall text-muted text-tools">
            <IoTimeOutline className="icon-small shrink-0" aria-hidden />
            8 min
          </span>
        </div>
        <Card.Title className="mt-xsmall">Article of the week</Card.Title>
        <Card.Description>
          Large image flush with card edges; caption and meta — in{" "}
          <code className="text-xs">Card.Header</code>.
        </Card.Description>
      </Card.Header>
      <Card.Footer className="flex items-center justify-between gap-base">
        <Text as="span" variant="tools" className="text-muted">
          Author: studio
        </Text>
        <Button variant="ghost" size="base" ripple>
          Read
          <IoArrowForward className="ml-xsmall inline icon-small align-middle" aria-hidden />
        </Button>
      </Card.Footer>
    </Card>
  ),
};

/** Horizontal split: media left, content right (stacks on narrow screens). */
export const HorizontalMediaSplit: Story = {
  name: "Horizontal split (media + text)",
  decorators: [...wideDarkDecorator],
  render: () => (
    <Card className="">
      <div className="flex min-w-0 flex-col min-[520px]:flex-row">
        <div className="relative aspect-[5/3] min-h-[11rem] w-full shrink-0 min-[520px]:aspect-auto min-[520px]:min-h-[14rem] min-[520px]:w-[44%]">
          <img
            src={PIN_IMAGE3}
            alt="Composition with soft light and geometry"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <Card.Header>
            <Card.Title>Course: visual hierarchy</Card.Title>
            <Card.Description>
              Layout «image + text column»
            </Card.Description>
          </Card.Header>
          <Card.Body className="flex-1 pt-0">
            <ul className="list-inside list-disc space-y-xsmall text-small leading-normal text-muted">
              <li>Spacing tokens from Body</li>
              <li>Footer with buttons pinned to column bottom</li>
            </ul>
          </Card.Body>
          <Card.Footer className="mt-0 flex justify-end gap-base border-t-token">
            <Button variant="primary" size="base" ripple>
              Enroll
            </Button>
          </Card.Footer>
        </div>
      </div>
    </Card>
  ),
};

/** Two preview columns in body — custom grid in `Card.Body`. */
export const BodyImageGrid: Story = {
  name: "2×1 image grid in body",
  decorators: [...wideDarkDecorator],
  render: () => (
    <Card className="max-w-3xl">
      <Card.Header>
        <Card.Title>Variant gallery</Card.Title>
        <Card.Description>
          In <code className="text-xs">Card.Body</code> — grid of two frames from{" "}
          <code className="text-xs">mockImages</code>.
        </Card.Description>
      </Card.Header>
      <Card.Body className="border-t-token px-mid pb-mid pt-mid">
        <div className="grid grid-cols-1 gap-small min-[480px]:grid-cols-2">
          <figure className="min-w-0 overflow-hidden rounded-base border-token flex flex-col gap-xsmall">
            <img
              src={PIN_IMAGE1}
              alt="Portrait in red helmet"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="px-base py-xsmall text-tools text-muted">Frame A</figcaption>
          </figure>
          <figure className="min-w-0 overflow-hidden rounded-base border-token flex flex-col gap-xsmall">
            <img
              src={PIN_IMAGE4}
              alt="Minimalist scene"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="px-base py-xsmall text-tools text-muted">Frame B</figcaption>
          </figure>
        </div>
      </Card.Body>
    </Card>
  ),
};

/** Status badges and dense action row — header and footer customization. */
export const WithBadgesAndMeta: Story = {
  name: "Badges and meta",
  render: () => (
    <Card variant="outline">
      <Card.Header>
        <div className="flex flex-wrap items-center gap-xsmall">
          <Badge status="success" size="small">
            Online
          </Badge>
          <Badge status="warning" size="small">
            Beta
          </Badge>
          <Badge variant="secondary" size="small">
            API v2
          </Badge>
        </div>
        <Card.Title className="mt-small">Notification service</Card.Title>
        <Card.Description>
          Combination of <code className="text-xs">Badge</code> and secondary text; card variant{" "}
          <code className="text-xs">outline</code>.
        </Card.Description>
      </Card.Header>
      <Card.Footer className="flex flex-wrap items-center justify-between gap-base">
        <span className="text-tools text-muted">Last deploy: today</span>
        <div className="flex flex-wrap gap-xsmall">
          <Button variant="ghost" size="small" ripple>
            Logs
          </Button>
          <Button variant="secondary" size="small" ripple>
            Settings
          </Button>
        </div>
      </Card.Footer>
    </Card>
  ),
};

/** Accent metric + label — custom block inside Body. */
export const MetricHighlight: Story = {
  name: "Metric (KPI)",
  render: () => (
    <Card variant="secondary" className="max-w-xs">
      <Card.Body className="gap-mid">
        <div>
          <Text as="span" variant="tools" className="font-medium uppercase tracking-wide text-muted">
            Conversion
          </Text>
          <div className="mt-xsmall flex items-baseline gap-xsmall">
            <Text as="span" variant="header-2" className="tabular-nums">
              4,8
            </Text>
            <Text as="span" variant="base" className="text-success">
              +12%
            </Text>
          </div>
        </div>
        <Separator />
        <Card.Description className="text-foreground">
          Compared to last week
        </Card.Description>
      </Card.Body>
    </Card>
  ),
};

/** Step list with separators — composition without images. */
export const StepsWithSeparators: Story = {
  name: "Steps with separators",
  render: () => (
    <Card>
      <Card.Header>
        <Card.Title>Publication checklist</Card.Title>
        <Card.Description>Three steps and <code className="text-xs">Separator</code> between blocks.</Card.Description>
      </Card.Header>
      <Card.Body className="px-mid pb-mid pt-0">
        <div className="rounded-base border-token px-base py-small flex flex-col gap-xsmall">
          <p className="text-small font-medium text-foreground">1. Draft</p>
          <p className="mt-xsmall text-tools text-muted">Text and media collected.</p>
        </div>
        <Separator className="my-small" />
        <div className="rounded-base border-token px-base py-small flex flex-col gap-xsmall">
          <p className="text-small font-medium text-foreground">2. Editorial</p>
          <p className="mt-xsmall text-tools text-muted">Edits and approval.</p>
        </div>
        <Separator className="my-small" />
        <div className="rounded-base border-token px-base py-small flex flex-col gap-xsmall">
          <p className="text-small font-medium text-foreground">3. Launch</p>
          <p className="mt-xsmall text-tools text-muted">Publication and newsletter.</p>
        </div>
      </Card.Body>
    </Card>
  ),
};

/** Pressable + cover + ripple — interactive «tile» card. */
export const PressableWithCoverImage: Story = {
  name: "Pressable with cover",
  render: function PressableCoverDemo() {
    const [n, setN] = useState(0);
    return (
      <Card pressable className="max-w-md" onPress={() => setN((c) => c + 1)}>
        <Ripple color={CARD_RIPPLE_COLOR.default} direction="out"/>
        <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
          <div className="relative aspect-[2/1] w-full shrink-0">
            <img
              src={PIN_IMAGE4}
              alt="Night scene with neon"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <Card.Header>
            <Card.Title>Open project</Card.Title>
            <Card.Description>
              Presses: <span className="tabular-nums">{n}</span>. Keyboard: Enter / Space.
            </Card.Description>
          </Card.Header>
        </div>
      </Card>
    );
  },
};

/** Four cards — all surface variants and four mock images. */
export const MosaicFourCards: Story = {
  name: "Mosaic: 4 cards × 4 images",
  decorators: [...wideDarkDecorator],
  render: () => {
    const tiles: {
      variant: CardVariant;
      src: string;
      alt: string;
      title: string;
      desc: string;
    }[] = [
      {
        variant: "default",
        src: PIN_IMAGE1,
        alt: "Portrait in red helmet",
        title: "Default",
        desc: "Dense surface and border.",
      },
      {
        variant: "outline",
        src: PIN_IMAGE2,
        alt: "Warm portrait",
        title: "Outline",
        desc: "Glass border.",
      },
      {
        variant: "secondary",
        src: PIN_IMAGE3,
        alt: "Light and geometry",
        title: "Secondary",
        desc: "Accent-wash.",
      },
      {
        variant: "default",
        src: PIN_IMAGE4,
        alt: "Neon scene",
        title: "Default again",
        desc: "Fourth photo from the set.",
      },
    ];
    return (
      <div className="grid grid-cols-1 gap-mid sm:grid-cols-2">
        {tiles.map((t) => (
          <Card key={t.title + t.variant} variant={t.variant}>
            <div className="relative aspect-[5/3] w-full shrink-0">
              <img
                src={t.src}
                alt={t.alt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <Card.Header>
              <Card.Title>{t.title}</Card.Title>
              <Card.Description>{t.desc}</Card.Description>
            </Card.Header>
          </Card>
        ))}
      </div>
    );
  },
};

/** Light theme: horizontal split with image. */
export const LightHorizontalCard: Story = {
  name: "Light theme: split with photo",
  decorators: [...lightThemeDecorator],
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="mx-auto w-full max-w-3xl">
      <Card>
        <div className="flex min-w-0 flex-col min-[480px]:flex-row">
          <div className="relative aspect-video w-full shrink-0 min-[480px]:w-2/5">
            <img
              src={PIN_IMAGE2}
              alt="Illustration for light theme"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <Card.Header className="min-[480px]:flex-1">
            <Card.Title>Card on light background</Card.Title>
            <Card.Description>
              Same layout as «Horizontal split», with light theme decorator.
            </Card.Description>
          </Card.Header>
          <Card.Body className="pt-0">
            <Button className="mt-small w-full min-[480px]:w-auto" variant="primary" size="base" ripple>
              Action
            </Button>
          </Card.Body>
        </div>
      </Card>
    </div>
  ),
};

export const LightTheme: Story = {
  name: "Light theme (Default)",
  decorators: [...lightThemeDecorator],
  render: () => (
    <Card>
      <Card.Header>
        <Card.Title>Card title</Card.Title>
        <Card.Description>
          Regular card without hover effect.
        </Card.Description>
      </Card.Header>
      <Card.Footer className="flex items-center justify-end gap-base">
        <Button variant="ghost" size="base" ripple>Cancel</Button>
        <Button variant="primary" size="base" ripple>Open</Button>
      </Card.Footer>
    </Card>
  ),
};

export const LightThemeVariants: Story = {
  name: "Light theme (all variants)",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex flex-col gap-mid">
      <Card variant="default">
        <Card.Header>
          <Card.Title>Default</Card.Title>
          <Card.Description>Static card, no hover lift.</Card.Description>
        </Card.Header>
      </Card>
      <Card variant="outline">
        <Card.Header>
          <Card.Title>Outline</Card.Title>
          <Card.Description>Transparent background and border.</Card.Description>
        </Card.Header>
      </Card>
      <Card variant="secondary">
        <Card.Header>
          <Card.Title>Secondary</Card.Title>
          <Card.Description>Accent-wash on surface.</Card.Description>
        </Card.Header>
      </Card>
      <Card variant="gloss">
        <Card.Header>
          <Card.Title>Gloss</Card.Title>
          <Card.Description>Glass panel with conic border and highlight.</Card.Description>
        </Card.Header>
      </Card>
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
      <div className="w-full max-w-md">
        <Story />
      </div>
    </div>
  );
}

function GlossDemo() {
  const [n, setN] = useState(0);
  return (
    <div className="flex flex-col gap-mid">
      <Card variant="gloss">
        <Card.Header>
          <Card.Title>Glass card</Card.Title>
          <Card.Description>
            variant=&quot;gloss&quot; — static glass panel with conic border.
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Text as="p" variant="base" className="text-muted">
            Content inside the gloss panel reads over the highlight and border.
          </Text>
        </Card.Body>
        <Card.Footer className="flex items-center justify-end gap-base">
          <Button variant="gloss" size="base">
            Gloss
          </Button>
          <Button variant="primary" size="base" ripple>
            Primary
          </Button>
        </Card.Footer>
      </Card>
      <Card variant="gloss" pressable onPress={() => setN((c) => c + 1)}>
        <Ripple color={CARD_RIPPLE_COLOR.gloss} direction="out" />
        <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
          <Card.Header>
            <Card.Title>Gloss + pressable</Card.Title>
            <Card.Description>
              Presses: {n}. Pressable card with the same glass styling.
            </Card.Description>
          </Card.Header>
        </div>
      </Card>
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
        story: "classNames customization for Card",
      },
    },
  },
  render: () => (
    <Card
      variant="outline"
      classNames={{
        root: "rounded-large border-primary/40 bg-primary/5 shadow-token-mid",
        header: "bg-primary/5",
        title: "text-primary font-semibold",
        description: "text-foreground/80",
        body: "text-small",
        footer: "border-primary/20 bg-primary/5",
      }}
    >
      <Card.Header>
        <Card.Title>Profile</Card.Title>
        <Card.Description>All slots configured via classNames.</Card.Description>
      </Card.Header>
      <Card.Body>
        <Text variant="small">Card content with custom spacing and colors.</Text>
      </Card.Body>
      <Card.Footer>
        <Button size="small">Save</Button>
      </Card.Footer>
    </Card>
  ),
};
