import { useLayoutEffect } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

import { ToggleButton } from "@/components/core/ToggleButton";
import type { MotionContext } from "@/components/core/utils/slotMotion";

const CIRCLE =
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z";
const HEART =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

function morphIcon(ctx: MotionContext, d: string) {
  const path = ctx.el.querySelector("path");
  if (!path) return;
  gsap.registerPlugin(MorphSVGPlugin);
  if (ctx.reduced) {
    gsap.set(path, { morphSVG: d });
    return;
  }
  ctx.onCleanup(() => gsap.killTweensOf(path));
  return gsap.to(path, {
    morphSVG: d,
    duration: 0.4,
    ease: "power2.inOut",
    overwrite: "auto",
  });
}

export function ToggleButtonMotionMorphHeartDemo() {
  useLayoutEffect(() => {
    gsap.registerPlugin(MorphSVGPlugin);
  }, []);

  return (
    <ToggleButton variant="outline">
      <ToggleButton.IconStart
        motion={{
          check: (ctx) => morphIcon(ctx, HEART),
          uncheck: (ctx) => morphIcon(ctx, CIRCLE),
        }}
      >
        <svg className="icon-base" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d={CIRCLE} />
        </svg>
      </ToggleButton.IconStart>
      <ToggleButton.Text>MorphSVG</ToggleButton.Text>
    </ToggleButton>
  );
}
