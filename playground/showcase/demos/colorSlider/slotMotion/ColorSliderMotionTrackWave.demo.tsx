import { ColorSlider } from "@/components/core/ColorPicker";

export function ColorSliderMotionTrackWaveDemo() {
  return (
    <ColorSlider
      channel="hue"
      defaultValue={200}
      label="Hue"
      motion={{
        root: {
          enter: (ctx) =>
            ctx.fromTo({ opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }),
        },
        track: {
          enter: (ctx) => ctx.fromTo({ scaleX: 0.85 }, { scaleX: 1, duration: 0.28 }),
        },
      }}
    />
  );
}
