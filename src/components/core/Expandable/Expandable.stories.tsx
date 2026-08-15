import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Ripple } from "@/components/core/Ripple";
import { DualApiStoryPanel, DualApiStoryPanels } from "@/stories-utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/stories-utils/dualApiStorySource";

import { Expandable } from ".";
import { ExpandableMotionDemo } from "../../../../playground/showcase/demos/expandable/ExpandableMotion.demo";

const PIN_IMAGE =
  "https://i.pinimg.com/736x/89/e2/85/89e285ca1fc973db199bf395f7c89669.jpg";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-lg">
        <Story />
      </div>
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
      <div className="mx-auto w-full max-w-lg">
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
  title: "Core Components/Expandable",
  component: Expandable,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Expandable block. **Simple** — `title`, `description`, `icon` on root, content in `children`. **Compound** — `Trigger`, `Panel`, optional `Message`, `Icon`, `Content`, `Title`, `Description`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  args: {
    title: "Title",
  },
} satisfies Meta<typeof Expandable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple and Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props on &lt;Expandable&gt;">
        <Expandable
          title="Notifications"
          icon={infoIcon}
          description="Short description in trigger"
        >
          <p className="text-sm leading-relaxed">
            Panel content — any root children, no separate Panel.
          </p>
        </Expandable>
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — Trigger / Message">
        <Expandable>
          <Expandable.Trigger>
            <Expandable.Message>
              <Expandable.Icon>{infoIcon}</Expandable.Icon>
              <Expandable.Content>
                <Expandable.Title>Notifications</Expandable.Title>
                <Expandable.Description>Short description in trigger</Expandable.Description>
              </Expandable.Content>
            </Expandable.Message>
          </Expandable.Trigger>
          <Expandable.Panel>
            <p className="text-sm leading-relaxed">
              Any content: text, lists, nested blocks.
            </p>
          </Expandable.Panel>
        </Expandable>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const Playground: Story = {
  render: (args) => (
    <Expandable {...args}>
      <p className="text-sm leading-relaxed">
        Any content inside the panel. In simple API, wrap it in{" "}
        <code className="text-xs">&lt;Expandable&gt;</code>.
      </p>
    </Expandable>
  ),
};

export const WithIcon: Story = {
  name: "With icon",
  render: () => (
    <Expandable title="Notifications" icon={infoIcon}>
      <p className="text-sm">Icon on the same line as the title.</p>
    </Expandable>
  ),
};

export const WithImage: Story = {
  name: "With image",
  render: () => (
    <Expandable
      defaultOpen
      title="Progress is a mindset"
      description="Editorial frame in the expandable block."
    >
      <img
        src={PIN_IMAGE}
        alt="Portrait in glossy red helmet, text on visor"
        className="w-full max-h-[min(420px,55vh)] rounded-mid object-cover"
        loading="lazy"
      />
    </Expandable>
  ),
};

export const PressRipple: Story = {
  name: "Ripple on press",
  render: () => (
    <Expandable>
      <Expandable.Trigger>
        <Ripple color="neutralMuted" />
        <Expandable.Content>
          <Expandable.Title>Click the title row</Expandable.Title>
          <Expandable.Description>
            Ripple among trigger children — layer across the full button (including chevron):{" "}
            <code className="text-xs">
              {`<Ripple color="neutralMuted" />`}
            </code>
          </Expandable.Description>
        </Expandable.Content>
      </Expandable.Trigger>
      <Expandable.Panel>
        <p className="text-sm">
          Separate mode for components focused on click feedback.
        </p>
      </Expandable.Panel>
    </Expandable>
  ),
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div className="flex flex-col gap-large text-left">
      <p className="text-sm text-muted">
        Trigger — native <code className="text-primary">&lt;button type=&quot;button&quot;&gt;</code> with{" "}
        <code className="text-primary">aria-expanded</code> and{" "}
        <code className="text-primary">aria-controls</code>. Panel —{" "}
        <code className="text-primary">role=&quot;region&quot;</code>,{" "}
        <code className="text-primary">aria-labelledby</code>; when closed —{" "}
        <code className="text-primary">aria-hidden</code> and <code className="text-primary">inert</code>.
      </p>
      <Expandable title="Notification settings" description="Email and push">
        <p className="text-sm">Content is unavailable from the keyboard while the block is collapsed.</p>
      </Expandable>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: /Notification settings/ });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText(/Content unavailable/)).toBeVisible();
  },
};

export const AllVariationsLight: Story = {
  name: "All variants — light theme",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex flex-col gap-large">
      <Expandable title="Title only">
        <p className="text-sm">Content without description in the trigger.</p>
      </Expandable>

      <Expandable title="With description" description="Additional line below the title.">
        <p className="text-sm">Text inside the panel.</p>
      </Expandable>

      <Expandable
        title="With icon"
        icon={infoIcon}
        description="Icon on the left."
      >
        <p className="text-sm">Content.</p>
      </Expandable>

      <Expandable
        defaultOpen
        title="With image"
        description="Default expanded."
      >
        <img
          src={PIN_IMAGE}
          alt=""
          className="w-full max-h-[min(320px,40vh)] rounded-mid object-cover"
          loading="lazy"
        />
      </Expandable>
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Expandable",
      },
    },
  },
  render: () => (
    <Expandable
      defaultOpen
      title="Settings"
      description="Slots configured via classNames"
      classNames={{
        root: "border border-primary/30",
        trigger: "bg-primary/5",
        title: "text-primary font-semibold",
        panel: "bg-primary/5",
      }}
    >
      <p className="text-small text-muted">Panel content.</p>
    </Expandable>
  ),
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <ExpandableMotionDemo />,
};
