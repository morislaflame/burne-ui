import { Skeleton } from "@/components/core/Skeleton";

export function SkeletonClassNamesFullDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-mid rounded-mid border border-info/25 p-mid">
      <div className="flex items-center gap-mid">
        <Skeleton.Circle
          animation="wave"
          size="h-10 w-10"
          classNames={{
            root: "bg-info/15 ring-2 ring-info/20",
            wave: "opacity-80",
          }}
        />
        <div className="flex flex-1 flex-col gap-xsmall">
          <Skeleton
            animation="wave"
            className="h-3 w-28"
            classNames={{
              root: "rounded-full bg-info/15",
            }}
          />
          <Skeleton
            animation="pulse"
            className="h-3 w-20"
            classNames={{
              root: "rounded-full bg-info/10",
            }}
          />
        </div>
      </div>
      <Skeleton.Text
        animation="shimmer"
        lines={3}
        classNames={{
          line: "rounded-small bg-info/12",
        }}
      />
      <Skeleton.Block
        animation="wave"
        className="h-24 w-full"
        classNames={{
          root: "rounded-small bg-info/10",
        }}
      />
    </div>
  );
}
