import { Skeleton } from "@/components/core/Skeleton";

export function SkeletonArticlePreviewDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-mid">
      <Skeleton.Block variant="shimmer" className="h-36 w-full rounded-mid" />
      <Skeleton className="h-6 w-3/4 rounded-small" variant="shimmer" />
      <Skeleton.Text lines={3} variant="shimmer" />
      <div className="flex gap-small">
        <Skeleton className="h-8 w-20 rounded-small" variant="shimmer" />
        <Skeleton className="h-8 w-24 rounded-small" variant="shimmer" />
      </div>
    </div>
  );
}
