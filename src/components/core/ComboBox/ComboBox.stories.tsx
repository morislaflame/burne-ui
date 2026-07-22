import type { ComponentProps, ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen } from "storybook/test";
import { IoCaretDown, IoCheckmarkCircle, IoGlobeOutline } from "react-icons/io5";

import { ListBox } from "@/components/core/ListBox";
import { Button } from "@/components/core/Button";
import { DualApiStoryPanel, DualApiStoryPanels } from "@/stories-utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/stories-utils/dualApiStorySource";
import { OptionListItemLayoutShowcase } from "@/stories-utils/optionListItemStoryLayouts";

import type { ComboBoxOption } from "./comboBoxTypes";
import { ComboBox } from ".";

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

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border flex min-h-[18rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const sampleOptions: ComboBoxOption[] = [
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
    hint: "Title only in selection; hint only in list",
    icon: <IoGlobeOutline aria-hidden />,
  },
];

const meta = {
  title: "Core Components/ComboBox",
  component: ComboBox,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Searchable combobox. **Simple** — `options` on root; **Compound** — `<ComboBox.Label>`, `<ComboBox.InputGroup>` + `<ComboBox.Input>` / `<ComboBox.Trigger>`, `<ComboBox.Popover>` with `<ListBox>`. Panel — via `Popover`.",
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
} satisfies Meta<typeof ComboBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple and Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props on &lt;ComboBox&gt;">
        <ComboBox
          label="Interface language"
          hint="In the field — only the selected item name."
          placeholder="Select language"
          options={sampleOptions}
          defaultValue="ru"
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — children">
        <ComboBox options={sampleOptions} defaultValue="en">
          <ComboBox.Label>Interface language</ComboBox.Label>
          <ComboBox.InputGroup>
            <ComboBox.Input placeholder="Select language" />
            <ComboBox.Trigger />
          </ComboBox.InputGroup>
          <ComboBox.Popover />
          <ComboBox.Hint>Item description is visible only in the list.</ComboBox.Hint>
        </ComboBox>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const CustomListBox: Story = {
  name: "Compound ListBox",
  render: () => (
    <ComboBox options={sampleOptions} defaultValue="ru">
      <ComboBox.Label>Interface language</ComboBox.Label>
      <ComboBox.InputGroup>
        <ComboBox.Input placeholder="Select language" />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
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
      </ComboBox.Popover>
    </ComboBox>
  ),
};

const layoutShowcaseOptions: ComboBoxOption[] = [
  { value: "label-only", label: "Label only" },
  { value: "label-hint", label: "Label + Hint", hint: "ItemHint → second line in the middle column" },
  { value: "label-icon", label: "Label + Icon" },
  { value: "indicator-label", label: "Indicator + Label" },
  {
    value: "full-grid",
    label: "Indicator + Label + Hint + Icon",
    hint: "3 cols × 2 rows — all slots filled",
    icon: <IoGlobeOutline aria-hidden />,
  },
  { value: "member", label: "Anya Ivanova", hint: "@anya · on the team since 2023" },
  { value: "action", label: "More actions" },
];

export const CustomItemParts: Story = {
  name: "Compound — slot layout",
  render: () => (
    <ComboBox options={layoutShowcaseOptions} defaultValue="full-grid">
      <ComboBox.Label>Slot layout</ComboBox.Label>
      <ComboBox.InputGroup>
        <ComboBox.Input placeholder="Select item" />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox selectionIndicator={false}>
          <ListBox.Section>
            <ListBox.Header>How the grid changes</ListBox.Header>
            <OptionListItemLayoutShowcase
              Item={ListBox.Item}
              ItemLabel={ListBox.Label}
              ItemHint={ListBox.Hint}
              ItemIcon={ListBox.Icon}
              ItemIndicator={ListBox.ItemIndicator}
            />
          </ListBox.Section>
        </ListBox>
      </ComboBox.Popover>
      <ComboBox.Hint>
        Hint and Icon change row and column counts; rest-children — extra row (tags on «member»).
      </ComboBox.Hint>
    </ComboBox>
  ),
};

type ComboBoxStoryProps = ComponentProps<typeof ComboBox>;

function ControlledComboBox(props: ComboBoxStoryProps) {
  const [value, setValue] = useState("ru");
  return (
    <ComboBox
      {...props}
      value={value}
      onValueChange={setValue}
      options={props.options ?? sampleOptions}
    />
  );
}

export const Outline: Story = {
  render: () => (
    <ControlledComboBox variant="outline" label="Interface language" placeholder="Select language" />
  ),
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
          Open list
        </Button>
        <ComboBox
          label="Language"
          options={sampleOptions}
          defaultValue="ru"
          open={open}
          onOpenChange={setOpen}
          hint={open ? "Popup open" : "Popup closed"}
          placeholder="Select language"
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
    <ComboBox
      label="Language"
      options={sampleOptions}
      defaultValue="en"
      defaultOpen
      hint="Popup starts open via defaultOpen"
      placeholder="Select language"
    />
  ),
};

export const SelectInteraction: Story = {
  name: "Interaction: selection",
  render: () => (
    <ControlledComboBox variant="outline" label="Interface language" placeholder="Select language" />
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open list" }));
    await userEvent.click(screen.getByRole("option", { name: /English/ }));
    await expect(canvas.getByDisplayValue("English")).toBeInTheDocument();
  },
};

export const Large: Story = {
  render: () => (
    <ControlledComboBox size="mid" label="Size mid" placeholder="Select language" />
  ),
};

export const Disabled: Story = {
  render: () => (
    <ComboBox
      disabled
      value="en"
      label="Language"
      options={sampleOptions}
      placeholder="Select language"
    />
  ),
};

export const LongList: Story = {
  name: "Long list",
  render: function LongList() {
    const many: ComboBoxOption[] = Array.from({ length: 40 }, (_, i) => ({
      value: `opt-${i}`,
      label: `Item ${i + 1}`,
      hint: i % 5 === 0 ? "With optional hint in list" : undefined,
      icon:
        i % 7 === 0 ? <IoCheckmarkCircle aria-hidden className="text-success" /> : undefined,
    }));
    const [value, setValue] = useState("opt-0");
    return (
      <ComboBox
        label="Many items"
        hint="Scroll inside `<ComboBox.Popover>`."
        options={many}
        value={value}
        onValueChange={setValue}
        menuMaxHeight="min(12rem, 50vh)"
      />
    );
  },
};

export const LightTheme: Story = {
  decorators: [...lightThemeDecorator],
  render: () => (
    <ControlledComboBox label="Interface language" hint="Light theme" placeholder="Select language" />
  ),
};

export const Validation: Story = {
  name: "Validation",
  render: () => (
    <ComboBox status="danger" required options={sampleOptions}>
      <ComboBox.Label>Interface language</ComboBox.Label>
      <ComboBox.InputGroup>
        <ComboBox.Input placeholder="Select language" />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover />
      <ComboBox.Hint>Language affects the interface and emails.</ComboBox.Hint>
      <ComboBox.Error>Select a language from the list.</ComboBox.Error>
    </ComboBox>
  ),
};

export const CustomTriggerIcon: Story = {
  name: "Custom trigger icon",
  parameters: {
    docs: {
      description: {
        story:
          "`ComboBox.Trigger` children replace the default chevron (`children ?? <IoChevronDown />`).",
      },
    },
  },
  render: () => (
    <ComboBox options={sampleOptions} defaultValue="ru">
      <ComboBox.Label>Interface language</ComboBox.Label>
      <ComboBox.InputGroup>
        <ComboBox.Input placeholder="Select language" />
        <ComboBox.Trigger>
          <IoCaretDown aria-hidden className="icon-small text-primary" />
        </ComboBox.Trigger>
      </ComboBox.InputGroup>
      <ComboBox.Popover />
    </ComboBox>
  ),
};

export const Accessibility: Story = {
  name: "Accessibility",
  render: () => (
    <div className="flex flex-col gap-plus text-left">
      <p className="text-sm text-muted">
        Combobox — <code className="text-primary">aria-expanded</code>,{" "}
        <code className="text-primary">aria-controls</code>,{" "}
        <code className="text-primary">aria-activedescendant</code>. Listbox inside Popover.
      </p>
      <ComboBox status="danger" required options={sampleOptions}>
        <ComboBox.Label>Interface language</ComboBox.Label>
        <ComboBox.InputGroup>
          <ComboBox.Input placeholder="Select language" />
          <ComboBox.Trigger />
        </ComboBox.InputGroup>
        <ComboBox.Popover />
        <ComboBox.Hint>Language affects the interface and emails.</ComboBox.Hint>
        <ComboBox.Error>Select a language from the list.</ComboBox.Error>
      </ComboBox>
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for ComboBox",
      },
    },
  },
  render: () => (
    <ControlledComboBox
      label="Interface language"
      hint="Slots configured via classNames"
      classNames={{
        inputGroup: "border-primary/40 bg-primary/5",
        input: "text-primary placeholder:text-primary/50",
        trigger: "text-primary hover:text-primary",
        popoverBody: "bg-primary/5",
      }}
    />
  ),
};
