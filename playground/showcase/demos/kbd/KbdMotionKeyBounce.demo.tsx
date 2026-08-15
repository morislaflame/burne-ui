import gsap from "gsap";

import { Kbd } from "@/components/core/Kbd";

const TL = { overwrite: "auto" as const, force3D: false };

export function KbdMotionKeyBounceDemo() {
  return (
    <Kbd
      variant="primary"
      motion={{
        root: {
          hoverIn: (ctx) =>
            gsap.to(ctx.el, { scale: 1.12, y: -4, duration: 0.28, ease: "back.out(2.4)", ...TL }),
          hoverOut: (ctx) =>
            gsap.to(ctx.el, { scale: 1, y: 0, duration: 0.18, ease: "power2.out", ...TL }),
        },
      }}
    >
      Enter
    </Kbd>
  );
}
