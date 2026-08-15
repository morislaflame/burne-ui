import gsap from "gsap";

import { ToggleButton } from "@/components/core/ToggleButton";

const ORIGIN = "50% 100%";
const TL = { overwrite: "auto" as const, force3D: false };

export function ToggleButtonMotionFillFromBottomDemo() {
  return (
    <ToggleButton
      variant="outline"
      motion={{
        fill: {
          check: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { scale: 0, autoAlpha: 0, transformOrigin: ORIGIN },
              { scale: 1, autoAlpha: 1, duration: 0.38, ease: "power3.out", transformOrigin: ORIGIN, ...TL },
            ),
          uncheck: (ctx) =>
            gsap.to(ctx.el, {
              scale: 0,
              autoAlpha: 0,
              duration: 0.2,
              ease: "power2.in",
              transformOrigin: ORIGIN,
              ...TL,
            }),
        },
      }}
    >
      Fill from bottom
    </ToggleButton>
  );
}
