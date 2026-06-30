import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { CloseButton } from "./index";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
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
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/CloseButton",
  component: CloseButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...darkThemeDecorator],
  args: {
    variant: "default",
    size: "base",
    animated: true,
    disabled: false,
    ripple: false,
    "aria-label": "Закрыть",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "outline", "secondary", "ghost", "gloss"],
    },
    size: {
      control: "select",
      options: ["small", "base", "mid", "large"],
    },
    animated: { control: "boolean" },
    ripple: {
      control: "boolean",
      description:
        "Встроенный `<Ripple />` с тоном под variant. По умолчанию в сторибуке выключен.",
    },
  },
  render: (args) => <CloseButton {...args} />,
} satisfies Meta<typeof CloseButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ClickInteraction: Story = {
  name: "Interaction: клик",
  args: {
    onClick: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Закрыть" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Sizes: Story = {
  name: "Размеры (small — large)",
  render: () => (
    <div className="flex items-center gap-plus">
      <CloseButton size="small" aria-label="Закрыть small" />
      <CloseButton size="base" aria-label="Закрыть base" />
      <CloseButton size="mid" aria-label="Закрыть mid" />
      <CloseButton size="large" aria-label="Закрыть large" />
    </div>
  ),
};

export const Variants: Story = {
  name: "Варианты",
  render: () => (
    <div className="flex flex-wrap items-center gap-plus">
      <CloseButton variant="default" aria-label="Закрыть default" />
      <CloseButton aria-label="Закрыть (по умолчанию)" />
      <CloseButton variant="primary" aria-label="Закрыть primary" />
      <CloseButton variant="outline" aria-label="Закрыть outline" />
      <CloseButton variant="secondary" aria-label="Закрыть secondary" />
      <CloseButton variant="ghost" aria-label="Закрыть ghost" />
      <CloseButton variant="gloss" aria-label="Закрыть gloss" />
    </div>
  ),
};

export const VariantsOnLightTheme: Story = {
  name: "Варианты — светлая тема",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex flex-wrap items-center gap-plus">
      <CloseButton variant="default" aria-label="Закрыть default" />
      <CloseButton aria-label="Закрыть (по умолчанию)" />
      <CloseButton variant="primary" aria-label="Закрыть primary" />
      <CloseButton variant="outline" aria-label="Закрыть outline" />
      <CloseButton variant="secondary" aria-label="Закрыть secondary" />
      <CloseButton variant="ghost" aria-label="Закрыть ghost" />
      <CloseButton variant="gloss" aria-label="Закрыть gloss" />
    </div>
  ),
};

export const VariantSizesMatrix: Story = {
  name: "Матрица variant × size",
  render: () => (
    <div className="flex flex-col gap-plus">
      {(["default", "primary", "outline", "secondary", "ghost"] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-plus">
          <span className="text-muted text-small w-20 shrink-0">{variant}</span>
          <CloseButton variant={variant} size="small" aria-label={`${variant} small`} />
          <CloseButton variant={variant} size="base" aria-label={`${variant} base`} />
          <CloseButton variant={variant} size="mid" aria-label={`${variant} mid`} />
          <CloseButton variant={variant} size="large" aria-label={`${variant} large`} />
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithoutAnimation: Story = {
  name: "Без анимации нажатия",
  args: { animated: false },
};

export const WithRipple: Story = {
  name: "С рипплом",
  args: { ripple: true },
};

export const OnLightTheme: Story = {
  name: "Светлая тема (data-theme)",
  decorators: [...lightThemeDecorator],
};

export const CustomClassNames: Story = {
  name: "Полная кастомизация classNames",
  parameters: {
    docs: {
      description: {
        story: "кастомизация classNames для CloseButton",
      },
    },
  },
  render: () => (
    <CloseButton
      variant="outline"
      classNames={{
        root: "border-primary/50 bg-primary/5 shadow-token-md hover:bg-primary/10",
        icon: "text-primary",
      }}
      aria-label="Закрыть с кастомными слотами"
    />
  ),
};
