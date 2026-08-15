import gsap from "gsap";

import { Kbd } from "@/components/core/Kbd";

const TL = { overwrite: "auto" as const, force3D: false };

export function KbdMotionRootTiltDemo() {
  return (
    <Kbd
      variant="secondary"
      motion={{
        root: {
          hoverIn: (ctx) =>
            gsap.to(ctx.el, { rotation: -8, y: -2, duration: 0.22, ease: "power2.out", ...TL }),
          hoverOut: (ctx) =>
            gsap.to(ctx.el, { rotation: 0, y: 0, duration: 0.18, ease: "power2.out", ...TL }),
        },
      }}
    >
      ⌘
    </Kbd>
  );
}
