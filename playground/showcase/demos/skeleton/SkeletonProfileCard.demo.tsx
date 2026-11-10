import { Skeleton } from "@/components/core/Skeleton";
import { Surface } from "@/components/core/Surface";

export function SkeletonProfileCardDemo() {
  return (
    <Skeleton.Region busy aria-label="Profile card">
      <Surface variant="secondary" padding="large" className="flex w-full max-w-sm gap-large">
        <Skeleton.Circle className="size-12 shrink-0" animation="shimmer" />
        <div className="flex min-w-0 flex-1 flex-col gap-small">
          <Skeleton className="h-4 w-32 rounded-small" animation="shimmer" />
          <Skeleton.Text lines={2} animation="shimmer" />
        </div>
      </Surface>
    </Skeleton.Region>
  );
}
