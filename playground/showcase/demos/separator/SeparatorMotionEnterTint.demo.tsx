import gsap from "gsap";

import { Separator } from "@/components/core/Separator";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function SeparatorMotionEnterTintDemo() {
  return (
    <Separator
      className="w-full"
      motion={{
        root: {
          enter: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.fromTo(ctx.el, { y: -4 }, { y: 0, duration: 0.24 }, 0);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
        },
      }}
    />
  );
}
