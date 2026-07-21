import type { ComponentProps, ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen } from "storybook/test";
import { IoGlobeOutline } from "react-icons/io5";

import { ListBox } from "@/components/core/ListBox";
import { Button } from "@/components/core/Button";
import { DualApiStoryPanel, DualApiStoryPanels } from "@/stories-utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/stories-utils/dualApiStorySource";
import { glossDottedDecorator } from "@/stories-utils/glossStoryChrome";

import type { SelectOption } from "./selectTypes";
import { Select } from ".";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[18rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const sampleOptions: SelectOption[] = [
  {
    value: "ru",
    label: "Russian",
    hint: "Interface and notifications in Russian",
    icon: <IoGlobeOutline aria-hidden />,
  },
  {
    value: "en",
    label: "English",
    hint: "UI and notifications in English",
    icon: <IoGlobeOutline aria-hidden />,
  },
  {
    value: "de",
    label: "Deutsch",
    hint: "Hint only in list",
    icon: <IoGlobeOutline aria-hidden />,
  },
];

const meta = {
  title: "Core Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Select without search. **Simple** — `options` on root; **Compound** — `<Select.Label>`, `<Select.TriggerGroup>` + `<Select.Value>` / `<Select.Trigger>`, `<Select.Popover>` with `<ListBox>`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    size: { control: "select", options: ["small", "base", "mid", "large"] },
    variant: { control: "select", options: ["default", "outline", "secondary", "gloss"] },
    status: {
      control: "select",
      options: ["default", "danger", "success", "warning"],
    },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple and Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props on &lt;Select&gt;">
        <Select
          label="Interface language"
          hint="No search field — list selection only."
          placeholder="Select language"
          options={sampleOptions}
          defaultValue="ru"
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <Select options={sampleOptions} defaultValue="en">
          <Select.Label>Interface language</Select.Label>
          <Select.TriggerGroup>
            <Select.Value placeholder="Select language" />
            <Select.Trigger />
          </Select.TriggerGroup>
          <Select.Popover />
          <Select.Hint>Item description is visible only in the list.</Select.Hint>
        </Select>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const CustomListBox: Story = {
  name: "Compound ListBox",
  render: () => (
    <Select options={sampleOptions} defaultValue="ru">
      <Select.Label>Interface language</Select.Label>
      <Select.TriggerGroup>
        <Select.Value placeholder="Select language" />
        <Select.Trigger />
      </Select.TriggerGroup>
      <Select.Popover>
        <ListBox.Section>
          <ListBox.Header>Available languages</ListBox.Header>
          <ListBox.Item value="ru">
            <ListBox.ItemIndicator />
            <ListBox.Label>Russian</ListBox.Label>
            <ListBox.Hint>Cyrillic</ListBox.Hint>
          </ListBox.Item>
          <ListBox.Item value="en">
            <ListBox.ItemIndicator />
            <ListBox.Label>English</ListBox.Label>
            <ListBox.Hint>Latin script</ListBox.Hint>
            <ListBox.Icon>
              <IoGlobeOutline aria-hidden />
            </ListBox.Icon>
          </ListBox.Item>
        </ListBox.Section>
      </Select.Popover>
    </Select>
  ),
};

type SelectStoryProps = ComponentProps<typeof Select>;

export const Controlled: Story = {
  name: "Controlled value",
  render: function ControlledStory() {
    const [value, setValue] = useState("react");
    const options: SelectOption[] = [
      { value: "react", label: "React" },
      { value: "svelte", label: "Svelte" },
      { value: "vue", label: "Vue" },
    ];
    return (
      <Select
        label="Framework"
        options={options}
        value={value}
        onValueChange={setValue}
        hint={`Selected: ${value}`}
      />
    );
  },
};

export const ControlledOpen: Story = {
  name: "Controlled open",
  parameters: {
    docs: {
      description: {
        story: "`open` / `onOpenChange` control the popup independently of value.",
      },
    },
  },
  render: function ControlledOpenStory() {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex w-full flex-col gap-mid">
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          Open menu
        </Button>
        <Select
          label="Framework"
          options={sampleOptions}
          defaultValue="ru"
          open={open}
          onOpenChange={setOpen}
          hint={open ? "Popup open" : "Popup closed"}
        />
      </div>
    );
  },
};

export const DefaultOpen: Story = {
  name: "Uncontrolled open (defaultOpen)",
  parameters: {
    docs: {
      description: {
        story: "`defaultOpen` opens the popup on mount without parent state.",
      },
    },
  },
  render: () => (
    <Select
      label="Language"
      options={sampleOptions}
      defaultValue="en"
      defaultOpen
      hint="Popup starts open via defaultOpen"
    />
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex w-full flex-col gap-mid">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <Select
          key={size}
          size={size}
          label={`size="${size}"`}
          options={sampleOptions}
          defaultValue="ru"
        />
      ))}
    </div>
  ),
};

function SelectGlossDemo() {
  return (
    <div className="flex w-full flex-col gap-plus">
      <Select
        variant="gloss"
        label="Interface language"
        hint='variant="gloss" — glass field shell.'
        placeholder="Select language"
        options={sampleOptions}
        defaultValue="ru"
      />
      <Select variant="gloss" size="small" label="Small" options={sampleOptions} defaultValue="en" />
      <Select variant="gloss" size="mid" label="Mid" options={sampleOptions} defaultValue="de" />
      <Select options={sampleOptions} defaultValue="ru" variant="gloss">
        <Select.Label>Compound gloss</Select.Label>
        <Select.TriggerGroup>
          <Select.Value placeholder="Select language" />
          <Select.Trigger />
        </Select.TriggerGroup>
        <Select.Popover />
        <Select.Hint>Popover is also in gloss variant.</Select.Hint>
      </Select>
      <Select variant="gloss" disabled label="Disabled" options={sampleOptions} defaultValue="en" />
    </div>
  );
}

export const Gloss: Story = {
  name: "Gloss",
  parameters: { controls: { disable: true } },
  decorators: [glossDottedDecorator(false)],
  render: () => <SelectGlossDemo />,
};

export const GlossLight: Story = {
  name: "Gloss — light theme",
  parameters: { controls: { disable: true } },
  decorators: [glossDottedDecorator(true)],
  render: () => <SelectGlossDemo />,
};

export const Keyboard: Story = {
  name: "Keyboard",
  render: () => (
    <Select
      label="Framework"
      options={[
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" },
      ]}
      defaultValue="react"
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox");
    await userEvent.click(trigger);
    await expect(screen.getByRole("listbox")).toBeInTheDocument();
  },
};

export const CustomClassNames: Story = {
  name: "classNames",
  render: () => (
    <Select
      label="Custom slots"
      options={sampleOptions}
      defaultValue="ru"
      classNames={{
        triggerGroup: "ring-1 ring-primary/20",
        value: "text-primary",
        popover: "ring-1 ring-primary/15",
      }}
    />
  ),
};

export const StatusDanger: Story = {
  name: "status danger",
  render: () => (
    <Select
      label="Required field"
      status="danger"
      error="Select a value"
      options={sampleOptions}
      required
    />
  ),
};

export const Playground: Story = {
  name: "Playground",
  args: {
    label: "Language",
    placeholder: "Select language",
    options: sampleOptions,
    defaultValue: "ru",
    size: "base",
    variant: "default",
    status: "default",
  } satisfies SelectStoryProps,
};
