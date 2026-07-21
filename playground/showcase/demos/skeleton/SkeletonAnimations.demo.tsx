import { Skeleton } from "@/components/core/Skeleton";

export function SkeletonAnimationsDemo() {
  return (
    <div className="flex flex-col gap-mid">
      <div className="flex flex-wrap gap-mid">
        <Skeleton animation="pulse" className="h-8 w-24 rounded-small" />
        <Skeleton animation="wave" className="h-8 w-24 rounded-small" />
        <Skeleton animation="shimmer" className="h-8 w-24 rounded-small" />
      </div>
      <Skeleton.Block animation="shimmer" className="max-w-sm">
        <Skeleton.Text lines={2} animation="shimmer" />
      </Skeleton.Block>
    </div>
  );
}
