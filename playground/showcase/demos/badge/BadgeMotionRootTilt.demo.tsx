import gsap from "gsap";

import { Badge } from "@/components/core/Badge";

const TL = { overwrite: "auto" as const, force3D: false };

export function BadgeMotionRootTiltDemo() {
  return (
    <Badge
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
      Root tilt
    </Badge>
  );
}
