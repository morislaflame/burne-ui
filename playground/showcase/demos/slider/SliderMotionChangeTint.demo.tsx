import gsap from "gsap";

import { Slider } from "@/components/core/Slider";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function SliderMotionChangeTintDemo() {
  return (
    <Slider
      className="w-full max-w-sm"
      label="Change pulse"
      showValue
      defaultValue={30}
      step={5}
      hint="Phase change on track when value ticks. Fill width stays kit-internal."
      motion={{
        track: {
          change: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { scale: 1.015, duration: 0.1 }, 0);
            tl.to(ctx.el, { scale: 1, duration: 0.14 }, 0.1);
            if (ctx.targets.fill) tweenCssColor(ctx.targets.fill, "var(--color-primary)");
            if (ctx.targets.value) {
              tl.to(ctx.targets.value, { y: -3, duration: 0.1, yoyo: true, repeat: 1 }, 0);
            }
            return tl;
          },
        },
      }}
    />
  );
}
