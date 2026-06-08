import type { Meta, StoryObj } from "@storybook/react-vite";

import { LiquidGlass } from "./LiquidGlass";

/**
 * Decorator that provides a rich page-like background so the WebGL snapshot
 * has interesting content to refract and blur through the glass.
 */
function PageBackground({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
        background:
          "radial-gradient(ellipse 120% 80% at 20% 30%, rgb(110 231 183 / 0.4), transparent), " +
          "radial-gradient(circle at 80% 70%, rgb(99 102 241 / 0.5), transparent), " +
          "linear-gradient(160deg, #0c0d10, #1a1530 55%, #0f172a)",
      }}
    >
      {/* Background text/content that will be visible through the glass */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "60px 80px",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "rgba(255,255,255,0.12)",
            lineHeight: 1.1,
            letterSpacing: "-2px",
          }}
        >
          Liquid
          <br />
          Glass
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 120,
                height: 80,
                borderRadius: 16,
                background: `hsl(${i * 60}deg 60% 60% / 0.25)`,
              }}
            />
          ))}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 14,
            color: "rgba(255,255,255,0.3)",
            maxWidth: 480,
            lineHeight: 1.7,
          }}
        >
          Apple-style Liquid Glass uses WebGL to sample the underlying page
          content, apply refraction distortion, Gaussian blur, and tint.
        </div>
      </div>

      {/* Centered story content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 32,
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const meta = {
  title: "Core Components/LiquidGlass",
  component: LiquidGlass,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Apple-style Liquid Glass effect powered by WebGL. Captures a page snapshot on mount via html2canvas, then applies per-pixel refraction, Gaussian blur, and tint through a GLSL fragment shader.",
      },
    },
  },
  decorators: [
    (Story) => (
      <PageBackground>
        <Story />
      </PageBackground>
    ),
  ],
} satisfies Meta<typeof LiquidGlass>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rounded: Story = {
  name: "Rounded (default)",
  args: {
    shape: "rounded",
    style: { width: 280, minHeight: 120, padding: 24 },
    children: (
      <div style={{ color: "white", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Hello</div>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 6 }}>
          Liquid Glass
        </div>
      </div>
    ),
  },
};

export const Circle: Story = {
  args: {
    shape: "circle",
    style: { width: 120, height: 120 },
    children: (
      <span style={{ fontSize: 32 }} aria-label="star">
        ★
      </span>
    ),
  },
};

export const Pill: Story = {
  args: {
    shape: "pill",
    style: { width: 240, height: 64, paddingInline: 32 },
    children: (
      <span
        style={{
          color: "white",
          fontWeight: 600,
          fontSize: 16,
          whiteSpace: "nowrap",
        }}
      >
        Get Started
      </span>
    ),
  },
};

export const WithWarp: Story = {
  name: "Rounded + Warp",
  args: {
    shape: "rounded",
    warp: true,
    style: { width: 280, minHeight: 120, padding: 24 },
    children: (
      <div style={{ color: "white", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Warp enabled</div>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 6 }}>
          Center refraction is on
        </div>
      </div>
    ),
  },
};

export const HighBlur: Story = {
  name: "High blur",
  args: {
    shape: "rounded",
    blurRadius: 12,
    tintOpacity: 0.35,
    style: { width: 280, minHeight: 120, padding: 24 },
    children: (
      <div style={{ color: "white", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Heavy blur</div>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 6 }}>
          blurRadius: 12 · tintOpacity: 0.35
        </div>
      </div>
    ),
  },
};

export const AllShapes: Story = {
  name: "All shapes",
  render: () => (
    <>
      <LiquidGlass
        shape="rounded"
        style={{ width: 200, minHeight: 100, padding: 20 }}
      >
        <span style={{ color: "white", fontWeight: 600 }}>Rounded</span>
      </LiquidGlass>
      <LiquidGlass
        shape="pill"
        style={{ width: 200, height: 56, paddingInline: 28 }}
      >
        <span style={{ color: "white", fontWeight: 600 }}>Pill</span>
      </LiquidGlass>
      <LiquidGlass shape="circle" style={{ width: 100, height: 100 }}>
        <span style={{ color: "white", fontSize: 28 }}>◉</span>
      </LiquidGlass>
    </>
  ),
};

export const Playground: Story = {
  name: "Playground (all controls)",
  args: {
    shape: "rounded",
    blurRadius: 8.527,
    tintOpacity: 0.261,
    edgeIntensity: 0.015,
    rimIntensity: 0.102,
    baseIntensity: 0.022,
    edgeDistance: 0.283,
    rimDistance: 0.433,
    baseDistance: 0.09,
    cornerBoost: 0.01,
    rippleEffect: 0.0294,
    warp: false,
    style: { width: 300, minHeight: 140, padding: 28 },
    children: (
      <div style={{ color: "white", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Playground</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>
          Adjust controls in the args table below
        </div>
      </div>
    ),
  },
  argTypes: {
    shape: {
      control: "select",
      options: ["rounded", "circle", "pill"],
    },
    blurRadius: { control: { type: "range", min: 1, max: 15, step: 0.5 } },
    tintOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    edgeIntensity: {
      control: { type: "range", min: 0, max: 0.1, step: 0.001 },
    },
    rimIntensity: { control: { type: "range", min: 0, max: 0.2, step: 0.005 } },
    baseIntensity: {
      control: { type: "range", min: 0, max: 0.05, step: 0.001 },
    },
    edgeDistance: { control: { type: "range", min: 0.05, max: 0.5, step: 0.01 } },
    rimDistance: { control: { type: "range", min: 0.1, max: 2.0, step: 0.05 } },
    baseDistance: {
      control: { type: "range", min: 0.05, max: 0.3, step: 0.01 },
    },
    cornerBoost: { control: { type: "range", min: 0, max: 0.1, step: 0.002 } },
    rippleEffect: { control: { type: "range", min: 0, max: 0.5, step: 0.01 } },
    warp: { control: "boolean" },
  },
};
