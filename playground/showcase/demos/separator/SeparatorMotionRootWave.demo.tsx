import gsap from "gsap";

import { Separator } from "@/components/core/Separator";

const TL = { overwrite: "auto" as const, force3D: false };

export function SeparatorMotionRootWaveDemo() {
  return (
    <Separator
      className="w-full"
      motion={{
        root: {
          enter: (ctx) =>
            gsap.fromTo(ctx.el, { scaleX: 0.2, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.4, ...TL }),
        },
      }}
    />
  );
}
