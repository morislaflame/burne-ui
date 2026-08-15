import gsap from "gsap";

import { SelectionThumb } from "@/components/core/SelectionThumb";

const TL = { overwrite: "auto" as const, force3D: false };

export function SelectionThumbMotionRootWaveDemo() {
  return (
    <SelectionThumb
      motion={{
        root: {
          enter: (ctx) =>
            gsap.fromTo(ctx.el, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.28, ...TL }),
          hoverIn: (ctx) => gsap.to(ctx.el, { y: -3, duration: 0.16, ...TL }),
          hoverOut: (ctx) => gsap.to(ctx.el, { y: 0, duration: 0.14, ...TL }),
        },
      }}
    />
  );
}
