import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoCheckmarkCircle, IoGlobeOutline } from "react-icons/io5";

import { OptionListItemLayoutShowcase } from "@/stories-utils/optionListItemStoryLayouts";

import { ListBox } from "@/components/core/ListBox";
import { ListBoxMotionDemo } from "../../../../playground/showcase/demos/listBox/ListBoxMotion.demo";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[16rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="w-full max-w-sm">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/ListBox",
  component: ListBox,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Selection list (`role=\"listbox\"`) without its own background — wrapper (Popover, Card) is set outside. Compound: `<ListBox.Item>` with `<ListBox.Label>`, `<ListBox.Hint>`, `<ListBox.Icon>`; `<ListBox.ItemIndicator />` — only when explicitly added. Sections — `<ListBox.Section>` + `<ListBox.Header>`.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof ListBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "Basic",
  render: () => (
    <ListBox defaultValue="ru" aria-label="Interface language">
      <ListBox.Item value="ru" label="Russian" hint="Interface in Russian" />
      <ListBox.Item value="en" label="English" hint="UI in English" />
      <ListBox.Item value="de" label="Deutsch" disabled hint="Coming soon" />
    </ListBox>
  ),
};

export const SelectInteraction: Story = {
  name: "Interaction: selection",
  render: () => (
    <ListBox defaultValue="ru" aria-label="Interface language">
      <ListBox.Item value="ru" label="Russian" hint="Interface in Russian" />
      <ListBox.Item value="en" label="English" hint="UI in English" />
    </ListBox>
  ),
  play: async ({ canvas, userEvent }) => {
    const english = canvas.getByRole("option", { name: /English/ });
    await userEvent.click(english);
    await expect(english).toHaveAttribute("aria-selected", "true");
  },
};

export const KeyboardNavigation: Story = {
  name: "Interaction: keyboard",
  render: () => (
    <ListBox defaultValue="ru" aria-label="Interface language">
      <ListBox.Item value="ru" label="Russian" />
      <ListBox.Item value="en" label="English" />
      <ListBox.Item value="de" label="Deutsch" disabled />
    </ListBox>
  ),
  play: async ({ canvas, userEvent }) => {
    const list = canvas.getByRole("listbox", { name: /Interface language/ });
    list.focus();
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    const english = canvas.getByRole("option", { name: /English/ });
    await expect(english).toHaveAttribute("aria-selected", "true");
  },
};

export const Compound: Story = {
  name: "Compound",
  render: () => (
    <ListBox defaultValue="en" aria-label="Language settings">
      <ListBox.Section>
        <ListBox.Header>Languages</ListBox.Header>
        <ListBox.Item value="ru">
          <ListBox.ItemIndicator />
          <ListBox.Label>Russian</ListBox.Label>
          <ListBox.Hint>Cyrillic, default locale</ListBox.Hint>
          <ListBox.Icon>
            <IoGlobeOutline aria-hidden />
          </ListBox.Icon>
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
      <ListBox.Separator />
      <ListBox.Section>
        <ListBox.Header>Additional</ListBox.Header>
        <ListBox.Item value="sys">
          <ListBox.Label>System</ListBox.Label>
          <ListBox.Hint>Follow OS settings</ListBox.Hint>
        </ListBox.Item>
      </ListBox.Section>
    </ListBox>
  ),
};

export const Multiple: Story = {
  name: "Multi-select",
  render: function MultipleList() {
    const [value, setValue] = useState<string[]>(["a", "c"]);
    return (
      <ListBox multiple value={value} onValueChange={(v) => setValue(v as string[])} aria-label="Profile fields">
        <ListBox.Item value="a" label="User" hint="Name and avatar" indicator />
        <ListBox.Item value="b" label="Country" hint="ISO code" indicator />
        <ListBox.Item value="c" label="Status" indicator />
      </ListBox>
    );
  },
};

export const Empty: Story = {
  name: "Empty list",
  render: () => <ListBox.Empty />,
};

export const CustomEmpty: Story = {
  name: "Custom empty state",
  render: () => (
    <ListBox aria-label="Search results">
      <ListBox.Empty>Nothing found for query</ListBox.Empty>
    </ListBox>
  ),
};

export const WithIcons: Story = {
  name: "With icons",
  render: () => (
    <ListBox defaultValue="ok" aria-label="Statuses">
      <ListBox.Item value="ok">
        <ListBox.Label>Success</ListBox.Label>
        <ListBox.Icon>
          <IoCheckmarkCircle aria-hidden className="text-success" />
        </ListBox.Icon>
      </ListBox.Item>
      <ListBox.Item value="globe">
        <ListBox.Label>Global</ListBox.Label>
        <ListBox.Icon>
          <IoGlobeOutline aria-hidden />
        </ListBox.Icon>
      </ListBox.Item>
    </ListBox>
  ),
};

export const CustomItemParts: Story = {
  name: "Compound — slot layout",
  render: () => (
    <ListBox defaultValue="full-grid" aria-label="Variants layout">
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
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "Slots root, section, header, item, label, and hint via classNames prop.",
      },
    },
  },
  render: () => (
    <ListBox
      defaultValue="ru"
      aria-label="Interface language"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        headerText: "text-primary",
        item: "rounded-lg",
        label: "font-semibold",
        hint: "text-muted/80",
      }}
    >
      <ListBox.Section>
        <ListBox.Header textClassName="tracking-wide">Available languages</ListBox.Header>
        <ListBox.Item value="ru" label="Russian" hint="Cyrillic" />
        <ListBox.Item value="en" label="English" hint="Latin script" />
      </ListBox.Section>
    </ListBox>
  ),
};

export const SlotMotionGallery: Story = {
  name: "Slot motion gallery",
  render: () => <ListBoxMotionDemo />,
};
