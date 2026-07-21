import { Skeleton } from "@/components/core/Skeleton";
import { Surface } from "@/components/core/Surface";

const ROWS = 4;

export function SkeletonTableRowsDemo() {
  return (
    <Surface variant="secondary" padding="mid" className="w-full max-w-lg">
      <div className="flex flex-col gap-small">
        <div className="flex gap-mid pb-small">
          <Skeleton className="h-4 w-1/3 rounded-small" />
          <Skeleton className="h-4 w-1/4 rounded-small" />
          <Skeleton className="h-4 w-1/5 rounded-small" />
        </div>
        {Array.from({ length: ROWS }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-small" animation="pulse" />
        ))}
      </div>
    </Surface>
  );
}
