import type { Meta, StoryObj } from "@storybook/react-vite";

import { GlassSurface } from "./GlassSurface";

const meta = {
  title: "Core Components/GlassSurface",
  component: GlassSurface,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        className="box-border flex min-h-[420px] items-center justify-center p-xlarge font-sans"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 20% 30%, rgb(110 231 183 / 0.35), transparent), radial-gradient(circle at 80% 70%, rgb(99 102 241 / 0.45), transparent), linear-gradient(160deg, #0c0d10, #1a1530 55%, #0f172a)",
        }}
      >
        <div className="w-full max-w-md">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof GlassSurface>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    refractionIntensity: 1,
    contentClassName: "px-xlarge py-xlarge",
    children: (
      <div className="space-y-plus">
        <p className="text-lg font-medium text-foreground">Стеклянная панель</p>
        <p className="text-sm leading-relaxed text-muted">
          Линза с backdrop blur, нейтральный блик по периметру (OGL) и контент.
          За панелью — градиент.
        </p>
      </div>
    ),
  },
};

export const NoShader: Story = {
  name: "Только CSS (без OGL)",
  args: {
    refractionIntensity: 0,
    contentClassName: "px-xlarge py-xlarge",
    children: (
      <p className="text-sm text-muted">
        <code className="font-mono text-foreground">refractionIntensity: 0</code> —
        одна линза без шейдерного слоя.
      </p>
    ),
  },
};
