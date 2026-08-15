import gsap from "gsap";

import { Badge } from "@/components/core/Badge";

const TL = { overwrite: "auto" as const, force3D: false };

export function BadgeMotionDotPulseDemo() {
  return (
    <Badge
      dot
      status="success"
      aria-label="Live"
      motion={{
        root: {
          hoverIn: (ctx) =>
            gsap.to(ctx.el, { scale: 1.35, duration: 0.28, ease: "back.out(2.4)", ...TL }),
          hoverOut: (ctx) =>
            gsap.to(ctx.el, { scale: 1, duration: 0.18, ease: "power2.out", ...TL }),
        },
      }}
    />
  );
}
