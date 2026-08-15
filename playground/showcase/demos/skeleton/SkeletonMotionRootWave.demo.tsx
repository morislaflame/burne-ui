import gsap from "gsap";

import { Skeleton } from "@/components/core/Skeleton";

const TL = { overwrite: "auto" as const, force3D: false };

export function SkeletonMotionRootWaveDemo() {
  return (
    <Skeleton
      className="h-8 w-48"
      motion={{
        root: {
          enter: (ctx) =>
            gsap.fromTo(ctx.el, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.32, ...TL }),
        },
      }}
    />
  );
}
