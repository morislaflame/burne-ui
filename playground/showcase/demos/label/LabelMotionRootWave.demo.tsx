import gsap from "gsap";

import { Label } from "@/components/core/Label";

const TL = { overwrite: "auto" as const, force3D: false };

export function LabelMotionRootWaveDemo() {
  return (
    <Label
      required
      motion={{
        root: {
          enter: (ctx) =>
            gsap.fromTo(ctx.el, { x: -8, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ...TL }),
        },
        text: {
          hoverIn: (ctx) => gsap.to(ctx.el, { y: -2, duration: 0.16, ...TL }),
          hoverOut: (ctx) => gsap.to(ctx.el, { y: 0, duration: 0.14, ...TL }),
        },
      }}
    >
      Label wave
    </Label>
  );
}
