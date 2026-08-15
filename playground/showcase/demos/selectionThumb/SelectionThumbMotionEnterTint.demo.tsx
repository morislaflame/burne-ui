import gsap from "gsap";

import { SelectionThumb } from "@/components/core/SelectionThumb";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function SelectionThumbMotionEnterTintDemo() {
  return (
    <SelectionThumb
      motion={{
        root: {
          enter: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.fromTo(ctx.el, { rotate: -20 }, { rotate: 0, duration: 0.28 }, 0);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
        },
      }}
    />
  );
}
