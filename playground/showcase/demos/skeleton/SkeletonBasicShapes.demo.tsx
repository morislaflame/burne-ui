import { Skeleton } from "@/components/core/Skeleton";

export function SkeletonBasicShapesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-mid">
      <Skeleton className="h-10 w-32" />
      <Skeleton.Circle className="size-10" />
    </div>
  );
}
