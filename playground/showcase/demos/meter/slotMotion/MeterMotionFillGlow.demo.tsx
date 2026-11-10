import gsap from "gsap";

import { Meter } from "@/components/core/Meter";
import type { MotionContext } from "@/components/core/utils/slotMotion";

function glow(ctx: MotionContext) {
  const fill = ctx.targets.fill;
  if (!fill || ctx.reduced) return;
  ctx.onCleanup(() => {
    gsap.killTweensOf(fill);
    gsap.set(fill, { boxShadow: "none" });
  });
  return gsap.fromTo(
    fill,
    { boxShadow: "0 0 0 0 color-mix(in srgb, var(--color-warning) 0%, transparent)" },
    {
      boxShadow: "0 0 16px 3px color-mix(in srgb, var(--color-warning) 70%, transparent)",
      duration: 0.45,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
      overwrite: "auto",
      force3D: false,
    },
  );
}

export function MeterMotionFillGlowDemo() {
  return (
    <Meter
      className="w-full max-w-sm"
      label="Quota"
      showValue
      value={86}
      size="large"
      color="var(--color-warning)"
      motion={{
        track: { enter: glow },
      }}
    />
  );
}
