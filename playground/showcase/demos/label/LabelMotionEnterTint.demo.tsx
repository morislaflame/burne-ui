import gsap from "gsap";

import { Label } from "@/components/core/Label";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function LabelMotionEnterTintDemo() {
  return (
    <Label
      required
      motion={{
        text: {
          enter: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.fromTo(ctx.el, { y: 6 }, { y: 0, duration: 0.22 }, 0);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
        },
      }}
    >
      Enter tint
    </Label>
  );
}
