import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen } from "storybook/test";

import { Text } from "@/components/core/Text";

import { ColorPicker, ColorSlider, ColorSwatch, hsvaToColorString, hsvaToHex, type HSVA } from ".";

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[26rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
];

const meta = {
  title: "Core Components/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Color picker using Popover. `<ColorPicker>` + `<ColorPicker.Trigger>` + `<ColorPicker.Content>`. Includes 2D saturation×value canvas, hue slider, alpha slider (optional), hex input, preset swatches. Standalone: `<ColorSlider>` for individual channels, `<ColorSwatch>` for color display.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── ColorPicker stories ──────────────────────────────────────────────────────

export const Basic: Story = {
  name: "Basic",
  render: () => {
    const [color, setColor] = useState("#3b82f6");
    return (
      <div className="flex flex-col items-center gap-mid">
        <ColorPicker value={color} onValueChange={setColor}>
          <ColorPicker.Trigger />
          <ColorPicker.Content />
        </ColorPicker>
        <Text as="p" variant="small" className="text-muted font-mono">{color}</Text>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /Selected color/ }));
    await expect(screen.getByRole("textbox", { name: "Hex code of the color" })).toBeVisible();
  },
};

export const WithAlpha: Story = {
  name: "With transparency",
  render: () => {
    const [color, setColor] = useState("#3b82f6");
    return (
      <div className="flex flex-col items-center gap-mid">
        <ColorPicker value={color} onValueChange={setColor}>
          <ColorPicker.Trigger />
          <ColorPicker.Content showAlpha />
        </ColorPicker>
        <Text as="p" variant="small" className="text-muted font-mono">{color}</Text>
      </div>
    );
  },
};

export const WithPresets: Story = {
  name: "With presets",
  render: () => {
    const [color, setColor] = useState("#3b82f6");
    const presets = [
      "#ef4444", "#f97316", "#eab308", "#22c55e",
      "#3b82f6", "#8b5cf6", "#ec4899", "#ffffff",
      "#6b7280", "#000000",
    ];
    return (
      <div className="flex flex-col items-center gap-mid">
        <ColorPicker value={color} onValueChange={setColor}>
          <ColorPicker.Trigger swatchSize="large" />
          <ColorPicker.Content presets={presets} />
        </ColorPicker>
        <Text as="p" variant="small" className="text-muted font-mono">{color}</Text>
      </div>
    );
  },
};

export const FullFeatured: Story = {
  name: "All features",
  render: () => {
    const [color, setColor] = useState("#8b5cf6cc");
    const presets = [
      "#ef4444", "#f97316", "#eab308", "#22c55e",
      "#3b82f6", "#8b5cf6", "#ec4899",
    ];
    return (
      <div className="flex flex-col items-center gap-mid">
        <ColorPicker value={color} onValueChange={setColor} size="mid">
          <ColorPicker.Trigger swatchSize="large" />
          <ColorPicker.Content showAlpha presets={presets} />
        </ColorPicker>
        <Text as="p" variant="small" className="text-muted font-mono">{color}</Text>
      </div>
    );
  },
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => {
    const [c1, setC1] = useState("#3b82f6");
    const [c2, setC2] = useState("#22c55e");
    const [c3, setC3] = useState("#ec4899");
    return (
      <div className="flex items-end gap-xlarge">
        <div className="flex flex-col items-center gap-small">
          <Text as="span" variant="small" className="text-muted">small</Text>
          <ColorPicker value={c1} onValueChange={setC1} size="small">
            <ColorPicker.Trigger />
            <ColorPicker.Content />
          </ColorPicker>
        </div>
        <div className="flex flex-col items-center gap-small">
          <Text as="span" variant="small" className="text-muted">base</Text>
          <ColorPicker value={c2} onValueChange={setC2} size="base">
            <ColorPicker.Trigger />
            <ColorPicker.Content />
          </ColorPicker>
        </div>
        <div className="flex flex-col items-center gap-small">
          <Text as="span" variant="small" className="text-muted">mid</Text>
          <ColorPicker value={c3} onValueChange={setC3} size="mid">
            <ColorPicker.Trigger />
            <ColorPicker.Content />
          </ColorPicker>
        </div>
      </div>
    );
  },
};

export const Uncontrolled: Story = {
  name: "Uncontrolled",
  render: () => (
    <ColorPicker defaultValue="#ef4444" defaultOpen>
      <ColorPicker.Trigger />
      <ColorPicker.Content />
    </ColorPicker>
  ),
};

// ─── ColorSlider stories ──────────────────────────────────────────────────────

export const SliderChannels: Story = {
  name: "ColorSlider — channels",
  render: () => {
    const [hsva, setHsva] = useState<HSVA>({ h: 217, s: 90, v: 96, a: 80 });

    return (
      <div className="flex w-64 flex-col gap-mid">
        <ColorSlider
          channel="hue"
          color={hsva}
          label="Hue (H)"
          value={hsva.h}
          onValueChange={(h) => setHsva({ ...hsva, h })}
        />
        <ColorSlider
          channel="saturation"
          color={hsva}
          label="Saturation (S)"
          value={hsva.s}
          onValueChange={(s) => setHsva({ ...hsva, s })}
        />
        <ColorSlider
          channel="value"
          color={hsva}
          label="Value (V)"
          value={hsva.v}
          onValueChange={(v) => setHsva({ ...hsva, v })}
        />
        <ColorSlider
          channel="alpha"
          color={hsva}
          label="Transparency (A)"
          value={hsva.a}
          onValueChange={(a) => setHsva({ ...hsva, a })}
        />
        <div className="mt-small flex items-center gap-small">
          <div
            className="h-8 w-8 rounded-small border-token"
            style={{ backgroundColor: hsvaToColorString(hsva) }}
          />
          <Text as="span" variant="small" className="font-mono text-muted">
            {hsvaToHex(hsva)}
          </Text>
        </div>
      </div>
    );
  },
};

export const SliderSizes: Story = {
  name: "ColorSlider — sizes",
  render: () => {
    const hsva: HSVA = { h: 290, s: 75, v: 90, a: 100 };
    const sizes = ["small", "base", "mid", "large"] as Array<"small" | "base" | "mid" | "large">;
    return (
      <div className="flex w-72 flex-col gap-mid">
        {sizes.map((size) => (
          <div key={size} className="flex items-center gap-mid">
            <Text as="span" variant="small" className="w-12 text-right text-muted">{size}</Text>
            <div className="flex-1">
              <ColorSlider.Track channel="hue" color={hsva} defaultValue={hsva.h} size={size} />
            </div>
          </div>
        ))}
      </div>
    );
  },
};

// ─── ColorSwatch stories ──────────────────────────────────────────────────────

export const Swatches: Story = {
  name: "ColorSwatch — sizes and shapes",
  render: () => {
    const [selected, setSelected] = useState("#3b82f6");
    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];

    return (
      <div className="flex flex-col gap-large">
        {/* Sizes */}
        {(["small", "base", "mid", "large"] as const).map((size) => (
          <div key={size} className="flex items-center gap-mid">
            <Text as="span" variant="small" className="w-16 text-right text-muted">{size}</Text>
            <div className="flex gap-small">
              {colors.map((c) => (
                <ColorSwatch key={c} color={c} size={size} shape="rounded" onClick={() => setSelected(c)} selected={selected === c} />
              ))}
            </div>
          </div>
        ))}

        {/* Shapes */}
        <div className="flex flex-wrap gap-mid">
          {(["square", "rounded", "circle"] as const).map((shape) => (
            <div key={shape} className="flex flex-col items-center gap-xsmall">
              <Text as="span" variant="small" className="text-muted">{shape}</Text>
              <div className="flex gap-small">
                {colors.slice(0, 4).map((c) => (
                  <ColorSwatch key={c} color={c} size="mid" shape={shape} onClick={() => setSelected(c)} selected={selected === c} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const SwatchesWithTransparency: Story = {
  name: "ColorSwatch — with transparency",
  render: () => {
    const transparent = [
      "rgba(239,68,68,0.2)", "rgba(239,68,68,0.5)", "rgba(239,68,68,0.8)", "rgba(239,68,68,1)",
      "rgba(59,130,246,0.2)", "rgba(59,130,246,0.5)", "rgba(59,130,246,0.8)", "rgba(59,130,246,1)",
    ];
    return (
      <div className="flex gap-small">
        {transparent.map((c) => (
          <ColorSwatch key={c} color={c} size="large" shape="rounded" />
        ))}
      </div>
    );
  },
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for ColorPicker",
      },
    },
  },
  render: () => {
    const [color, setColor] = useState("#3b82f6");
    return (
      <ColorPicker
        value={color}
        onValueChange={setColor}
        classNames={{
          contentPanel: "border border-primary/30 bg-primary/5",
          area: "rounded-base ring-1 ring-primary/20",
          hexInput: "border-primary/30 bg-primary/10",
          hexInputField: "text-primary",
        }}
      >
        <ColorPicker.Trigger />
        <ColorPicker.Content />
      </ColorPicker>
    );
  },
};
