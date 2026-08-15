import gsap from "gsap";

import { Skeleton } from "@/components/core/Skeleton";

const TL = { overwrite: "auto" as const, force3D: false };

export function SkeletonMotionRegionEnterDemo() {
  return (
    <Skeleton.Region
      className="flex flex-col gap-small"
      motion={{
        region: {
          enter: (ctx) =>
            gsap.fromTo(ctx.el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ...TL }),
        },
      }}
    >
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-32" />
    </Skeleton.Region>
  );
}
