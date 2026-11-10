import { Skeleton } from "@/components/core/Skeleton";

export function SkeletonMotionRootWaveDemo() {
  return (
    <Skeleton
      className="h-8 w-48"
      motion={{
        root: {
          enter: (ctx) =>
            ctx.fromTo({ opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.32 }),
        },
      }}
    />
  );
}
