import { Skeleton } from "@/components/core/Skeleton";

export function SkeletonAnimationsDemo() {
  return (
    <div className="flex flex-col gap-mid">
      <div className="flex flex-wrap gap-mid">
        <Skeleton variant="pulse" className="h-8 w-24 rounded-small" />
        <Skeleton variant="wave" className="h-8 w-24 rounded-small" />
        <Skeleton variant="shimmer" className="h-8 w-24 rounded-small" />
      </div>
      <Skeleton.Block variant="shimmer" className="max-w-sm">
        <Skeleton.Text lines={2} variant="shimmer" />
      </Skeleton.Block>
    </div>
  );
}
