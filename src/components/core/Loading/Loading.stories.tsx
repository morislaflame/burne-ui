import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Text } from "@/components/core/Text";
import { COMPONENT_SIZES } from "@/components/core/utils/componentSize";

import { Loading, type LoadingColor, type LoadingType } from "./Loading";

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

const COLORS: LoadingColor[] = [
  "primary",
  "foreground",
  "muted",
  "secondary",
  "danger",
  "success",
  "info",
  "warning",
];

const meta = {
  title: "Core Components/Loading",
  component: Loading,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Loading indicator: circular spinner (`type=\"spinner\"`) or three GSAP bouncing dots (`type=\"dots\"`). Dot speed — `configureMotion({ loadingDotsDuration })` (wave step = duration / 3). Sizes `small | base | mid | large`.",
      },
    },
  },
  decorators: [...framedDecorator],
  args: {
    type: "spinner",
    size: "base",
    color: "primary",
  },
  argTypes: {
    type: { control: "select", options: ["spinner", "dots"] satisfies LoadingType[] },
    size: { control: "select", options: COMPONENT_SIZES },
    color: { control: "select", options: COLORS },
  },
} satisfies Meta<typeof Loading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status", { name: "Loading" })).toBeVisible();
  },
};

export const Dots: Story = {
  name: "Bouncing dots",
  args: {
    type: "dots",
    size: "mid",
    color: "primary",
  },
};

export const DotsColors: Story = {
  name: "Dots — colors",
  render: () => (
    <div className="flex flex-wrap items-end justify-center gap-2xlarge">
      {COLORS.map((color) => (
        <div key={color} className="flex flex-col items-center gap-small">
          <Loading type="dots" color={color} size="mid" />
          <Text as="span" variant="small" className="capitalize text-muted">
            {color}
          </Text>
        </div>
      ))}
    </div>
  ),
};

export const DotsSizes: Story = {
  name: "Dots — sizes",
  render: () => (
    <div className="flex flex-wrap items-end justify-center gap-2xlarge">
      {COMPONENT_SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-small">
          <Loading type="dots" size={size} />
          <Text as="span" variant="small" className="capitalize text-muted">
            {size}
          </Text>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-wrap items-end justify-center gap-2xlarge">
      {COMPONENT_SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-small">
          <Loading size={size} />
          <Text as="span" variant="small" className="capitalize text-muted">
            {size}
          </Text>
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  name: "Colors",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-2xlarge">
      {COLORS.map((color) => (
        <div key={color} className="flex flex-col items-center gap-small">
          <Loading color={color} size="mid" />
          <Text as="span" variant="small" className="capitalize text-muted">
            {color}
          </Text>
        </div>
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  name: "With label",
  render: () => (
    <div className="inline-flex items-center gap-base">
      <Loading size="small" />
      <Text as="span" variant="base" className="text-muted">
        Loading data…
      </Text>
    </div>
  ),
};

export const Centered: Story = {
  name: "Centered in block",
  render: () => (
    <div className="flex h-40 w-72 items-center justify-center rounded-mid border-token bg-surface">
      <Loading size="large" color="primary" label="Loading content" />
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  render: () => (
    <div className="flex flex-wrap items-center gap-2xlarge">
      <Loading
        type="spinner"
        size="mid"
        classNames={{
          root: "rounded-mid border border-primary/20 p-base",
          spinner: "border-t-info",
        }}
      />
      <Loading
        type="dots"
        size="mid"
        classNames={{
          root: "rounded-mid border border-primary/20 p-base",
          dots: "gap-small",
          dot: "bg-info",
        }}
      />
    </div>
  ),
};
