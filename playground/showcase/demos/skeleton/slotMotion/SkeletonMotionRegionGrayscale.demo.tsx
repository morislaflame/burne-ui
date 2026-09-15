import gsap from "gsap";

import { Skeleton } from "@/components/core/Skeleton";
import type { MotionContext } from "@/components/core/utils/slotMotion";

function colorize(ctx: MotionContext) {
  if (ctx.reduced) return;
  ctx.onCleanup(() => {
    gsap.killTweensOf(ctx.el);
    gsap.set(ctx.el, { filter: "none" });
  });
  return gsap.fromTo(
    ctx.el,
    { filter: "grayscale(1)" },
    {
      filter: "grayscale(0)",
      duration: 0.7,
      ease: "power2.out",
      overwrite: "auto",
      force3D: false,
    },
  );
}

export function SkeletonMotionRegionGrayscaleDemo() {
  return (
    <Skeleton.Region
      aria-label="Profile"
      className="flex w-full max-w-sm flex-col gap-small"
      motion={{
        region: { enter: colorize },
      }}
    >
      <div className="flex gap-base">
        <Skeleton.Circle size="h-control-mid w-control-mid" />
        <div className="flex min-w-0 flex-1 flex-col gap-small">
          <Skeleton className="h-4 w-32" />
          <Skeleton.Text lines={2} />
        </div>
      </div>
    </Skeleton.Region>
  );
}
