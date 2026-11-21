import { Skeleton } from "@/components/core/Skeleton";

export function SkeletonMotionInstantEnterDemo() {
  return <Skeleton className="h-8 w-48" motion={{ root: { enter: false } }} />;
}
