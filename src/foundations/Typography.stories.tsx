import type { Meta, StoryObj } from "@storybook/react-vite";

function TypographySamples() {
  return (
    <div
      className="box-border w-full max-w-3xl rounded-base border border-base p-mid text-foreground shadow-sm"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="flex flex-col gap-mid">
        <p className="text-accent-header">accent-header</p>
        <p className="text-header-1">header-1</p>
        <p className="text-header-2">header-2</p>
        <p className="text-large">text-large — 1.25rem, semibold, leading 1.2</p>
        <p className="text-mid">text-mid — как text-md + medium + leading 1.2</p>
        <p className="text-base">text-base — как text-sm + medium + leading 1.2</p>
        <p className="text-small text-muted">
          text-small — как text-xs + medium + leading 1
        </p>
        <p className="text-tools text-muted">tools — компактная служебка</p>
      </div>
    </div>
  );
}

const meta = {
  title: "Foundations/Typography",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas" },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Roles: Story = {
  name: "Роли текста",
  render: () => <TypographySamples />,
};

export const OnDarkCanvas: Story = {
  name: "Тёмный фон страницы",
  decorators: [
    (Story) => (
      <div
        className="box-border min-h-[18rem] w-full p-mid"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <Story />
      </div>
    ),
  ],
  render: () => <TypographySamples />,
};
