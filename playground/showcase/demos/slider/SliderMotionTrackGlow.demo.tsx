import { IoVolumeHigh } from "react-icons/io5";

import { Slider } from "@/components/core/Slider";

export function SliderMotionTrackGlowDemo() {
  return (
    <Slider
      className="w-full max-w-sm"
      label="Track glow"
      showValue
      defaultValue={40}
      icon={<IoVolumeHigh aria-hidden />}
      hint="Hover the track — fill + icon via ctx.targets (fill width stays CSS)"
      motion={{
        track: {
          hoverIn: (ctx) => {
            const tl = ctx.timeline();
            if (ctx.targets.fill) {
              tl.to(ctx.targets.fill, { autoAlpha: 0.72, duration: 0.2 }, 0);
            }
            if (ctx.targets.icon) {
              tl.to(ctx.targets.icon, { rotate: 25, scale: 1.15, duration: 0.22 }, 0);
            }
            if (ctx.targets.header) {
              tl.to(ctx.targets.header, { y: -3, duration: 0.2 }, 0);
            }
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = ctx.timeline();
            if (ctx.targets.fill) {
              tl.to(ctx.targets.fill, { autoAlpha: 1, duration: 0.16 }, 0);
            }
            if (ctx.targets.icon) {
              tl.to(ctx.targets.icon, { rotate: 0, scale: 1, duration: 0.18 }, 0);
            }
            if (ctx.targets.header) {
              tl.to(ctx.targets.header, { y: 0, duration: 0.16 }, 0);
            }
            return tl;
          },
        },
      }}
    />
  );
}
