import gsap from "gsap";

import { Slider } from "@/components/core/Slider";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function SliderMotionValuePopDemo() {
  return (
    <Slider
      className="w-full max-w-sm"
      label="Value pop"
      showValue
      defaultValue={58}
      hint="Thumb press timeline → ctx.targets.value"
      motion={{
        thumb: {
          pressIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { scale: 1.18, duration: 0.12, yoyo: true, repeat: 1, ease: "back.out(2)" }, 0);
            if (ctx.targets.value) {
              tl.to(ctx.targets.value, { y: -6, scale: 1.12, duration: 0.16, yoyo: true, repeat: 1 }, 0);
              tweenCssColor(ctx.targets.value, "var(--color-primary)");
            }
            return tl;
          },
          pressOut: (ctx) => {
            if (ctx.targets.value) {
              tweenCssColor(ctx.targets.value, "var(--color-muted-foreground)", { clearOnComplete: true });
            }
            return undefined;
          },
        },
      }}
    />
  );
}
