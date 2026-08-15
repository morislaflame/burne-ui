import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { DualApiStoryPanel, DualApiStoryPanels } from "@/stories-utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/stories-utils/dualApiStorySource";

import { TextArea } from "./index";
import { TextAreaMotionDemo } from "../../../../playground/showcase/demos/textarea/TextAreaMotion.demo";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Multiline field. **Simple** — `label`, `hint`, `error` on root; **Compound** — `<TextArea.Label>` / `<TextArea.Control>` / … Variants and statuses like `Input`. Minimum height matches `Input`; taller by dragging the bottom-right handle.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof TextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple and Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple">
        <TextArea
          label="Comment"
          hint="Up to 500 characters."
          placeholder="Your review…"
          rows={1}
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound">
        <TextArea>
          <TextArea.Label>Comment</TextArea.Label>
          <TextArea.Control placeholder="Your review…" rows={1} />
          <TextArea.Hint>Up to 500 characters.</TextArea.Hint>
        </TextArea>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const TypeInteraction: Story = {
  name: "Interaction: input",
  render: () => (
    <TextArea label="Comment" placeholder="Your review…" rows={3} />
  ),
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByRole("textbox", { name: "Comment" });
    await userEvent.type(field, "Sample review");
    await expect(field).toHaveValue("Sample review");
  },
};

export const Outline: Story = {
  render: () => (
    <TextArea>
      <TextArea.Label>Description</TextArea.Label>
      <TextArea.Control variant="outline" placeholder="Brief task summary…" />
      <TextArea.Hint>Outline variant — transparent shell background.</TextArea.Hint>
    </TextArea>
  ),
};

export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div className="flex w-full flex-col gap-xlarge">
      <TextArea label="Default" variant="default" placeholder="default" />
      <TextArea label="Outline" variant="outline" placeholder="outline" />
      <TextArea label="Secondary" variant="secondary" placeholder="secondary" />
    </div>
  ),
};

export const Statuses: Story = {
  name: "Statuses",
  render: () => (
    <div className="flex w-full flex-col gap-xlarge">
      <TextArea status="danger" label="Danger" error="Text is too short." defaultValue="OK" />
      <TextArea status="success" label="Success" hint="Text saved." defaultValue="Done" />
      <TextArea status="warning" label="Warning" hint="Review the wording." defaultValue="Draft" />
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex w-full flex-col gap-xlarge">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <TextArea key={size} size={size} label={size} placeholder={`size="${size}"`} />
      ))}
    </div>
  ),
};

export const NotResizable: Story = {
  name: "Without resize",
  render: () => (
    <TextArea resizable={false} label="Fixed height" hint="Handle disabled (`resizable={false}`)." />
  ),
};

export const Disabled: Story = {
  render: () => (
    <TextArea disabled label="Disabled" defaultValue="Unavailable for editing." />
  ),
};

export const Required: Story = {
  render: () => (
    <TextArea required label="Biography" placeholder="Tell us about yourself…" />
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for TextArea",
      },
    },
  },
  render: () => (
    <TextArea
      className="max-w-md"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        shell: "ring-1 ring-primary/15",
        control: "text-primary placeholder:text-primary/50",
        hint: "text-foreground/70",
        error: "font-medium",
      }}
      label="Comment"
      placeholder="Your review…"
      rows={3}
      status="danger"
      hint="Up to 500 characters."
      error="Text is too short."
    />
  ),
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <TextAreaMotionDemo />,
};
