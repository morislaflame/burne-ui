import gsap from "gsap";

import { ColorSlider } from "@/components/core/ColorPicker";

const TL = { overwrite: "auto" as const, force3D: false };

export function ColorSliderMotionTrackWaveDemo() {
  return (
    <ColorSlider
      channel="hue"
      defaultValue={200}
      label="Hue"
      motion={{
        root: {
          enter: (ctx) =>
            gsap.fromTo(ctx.el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ...TL }),
        },
        track: {
          enter: (ctx) => gsap.fromTo(ctx.el, { scaleX: 0.85 }, { scaleX: 1, duration: 0.28, ...TL }),
        },
      }}
    />
  );
}
