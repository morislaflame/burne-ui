import { useState, type ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { IoDocumentTextOutline, IoSettingsOutline, IoPersonOutline } from "react-icons/io5";

import { Text } from "@/components/core/Text";
import { COMPONENT_SIZES } from "@/components/core/utils/componentSize";

import { Tabs, type TabsOrientation, type TabsVariant } from ".";

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

const VARIANTS: TabsVariant[] = ["default", "outline", "secondary"];

const TAB_ITEMS = [
  { value: "account", label: "Аккаунт", icon: IoPersonOutline },
  { value: "documents", label: "Документы", icon: IoDocumentTextOutline },
  { value: "settings", label: "Настройки", icon: IoSettingsOutline },
] as const;

function TabsDemo({
  orientation = "horizontal",
  size = "base",
  variant = "default",
  defaultValue = "account",
}: {
  orientation?: TabsOrientation;
  size?: (typeof COMPONENT_SIZES)[number];
  variant?: TabsVariant;
  defaultValue?: string;
}) {
  return (
    <Tabs
      defaultValue={defaultValue}
      orientation={orientation}
      size={size}
      variant={variant}
      className={orientation === "vertical" ? "w-full max-w-2xl" : "w-full max-w-xl"}
    >
      <Tabs.List>
        {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
          <Tabs.Tab key={value} value={value}>
            <Icon aria-hidden className="icon-base shrink-0" />
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {TAB_ITEMS.map(({ value, label }) => (
        <Tabs.Panel key={value} value={value}>
          <Text as="p" variant="base" className="text-muted">
            Контент вкладки «{label}».
          </Text>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}

const meta = {
  title: "Core Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Compound Tabs: горизонтальная или вертикальная ориентация, шкала `small | base | mid | large`, три варианта поверхности (`default`, `outline`, `secondary`). Неактивные табы — `text-muted`; при hover текст приподнимается и становится primary; при нажатии — squeeze. Индикатор активного таба плавно переезжает.",
      },
    },
  },
  decorators: [...framedDecorator],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    size: { control: "select", options: COMPONENT_SIZES },
    variant: { control: "select", options: VARIANTS },
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TabsDemo />,
};

export const SwitchTabInteraction: Story = {
  name: "Interaction: вкладки",
  render: () => <TabsDemo />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("tab", { name: "Аккаунт" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await userEvent.click(canvas.getByRole("tab", { name: "Документы" }));
    await expect(canvas.getByRole("tab", { name: "Документы" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("Документы");
  },
};

export const Vertical: Story = {
  name: "Вертикальные",
  render: () => <TabsDemo orientation="vertical" />,
};

export const Variants: Story = {
  name: "Варианты",
  render: () => (
    <div className="flex w-full max-w-3xl flex-col gap-xlarge">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-small">
          <Text as="span" variant="small" className="font-medium capitalize text-muted">
            {variant}
          </Text>
          <TabsDemo variant={variant} />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex w-full max-w-3xl flex-col gap-xlarge">
      {COMPONENT_SIZES.map((size) => (
        <div key={size} className="flex flex-col gap-small">
          <Text as="span" variant="small" className="font-medium capitalize text-muted">
            {size}
          </Text>
          <TabsDemo size={size} />
        </div>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  name: "Контролируемый режим",
  render: function ControlledTabs() {
    const [value, setValue] = useState("documents");
    return (
      <div className="flex w-full max-w-xl flex-col gap-mid">
        <Tabs value={value} onValueChange={setValue}>
          <Tabs.List>
            {TAB_ITEMS.map(({ value: tabValue, label }) => (
              <Tabs.Tab key={tabValue} value={tabValue}>
                {label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {TAB_ITEMS.map(({ value: tabValue, label }) => (
            <Tabs.Panel key={tabValue} value={tabValue}>
              <Text as="p" variant="base">
                Активно: {label}
              </Text>
            </Tabs.Panel>
          ))}
        </Tabs>
        <Text as="p" variant="small" className="text-muted">
          value=&quot;{value}&quot;
        </Text>
      </div>
    );
  },
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <Tabs defaultValue="account" disabled>
      <Tabs.List>
        {TAB_ITEMS.map(({ value, label }) => (
          <Tabs.Tab key={value} value={value}>
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      <Tabs.Panel value="account">
        <Text as="p" variant="base" className="text-muted">
          Группа отключена.
        </Text>
      </Tabs.Panel>
    </Tabs>
  ),
};

export const CustomClassNames: Story = {
  name: "Полная кастомизация classNames",
  parameters: {
    docs: {
      description: {
        story: "кастомизация classNames для Tabs (compound API)",
      },
    },
  },
  render: () => (
    <Tabs
      defaultValue="account"
      classNames={{
        root: "max-w-xl rounded-mid border border-info/25 p-base",
        list: "bg-info/5 ring-1 ring-info/15",
        indicator: "bg-info/30",
        tab: "font-medium",
        tabText: "gap-small",
        panel: "rounded-small bg-info/5 p-mid",
      }}
    >
      <Tabs.List>
        {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
          <Tabs.Tab key={value} value={value}>
            <Icon aria-hidden className="icon-base shrink-0" />
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {TAB_ITEMS.map(({ value, label }) => (
        <Tabs.Panel key={value} value={value}>
          <Text as="p" variant="base" className="text-muted">
            Контент вкладки «{label}».
          </Text>
        </Tabs.Panel>
      ))}
    </Tabs>
  ),
};
