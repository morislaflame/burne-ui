import gsap from "gsap";

import { CloseButton } from "@/components/core/CloseButton";

const TL = { overwrite: "auto" as const, force3D: false };

export function CloseButtonMotionIconWaveDemo() {
  return (
    <CloseButton
      aria-label="Icon wave close"
      motion={{
        root: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: -3, rotate: -6, duration: 0.22 }, 0);
            if (ctx.targets.icon) {
              tl.to(ctx.targets.icon, { rotate: 28, scale: 1.12, duration: 0.22 }, 0);
            }
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: 0, rotate: 0, duration: 0.18 }, 0);
            if (ctx.targets.icon) {
              tl.to(ctx.targets.icon, { rotate: 0, scale: 1, duration: 0.18 }, 0);
            }
            return tl;
          },
        },
      }}
    />
  );
}
