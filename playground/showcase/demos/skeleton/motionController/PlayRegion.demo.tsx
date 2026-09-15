import { Button } from "@/components/core/Button";
import { Skeleton } from "@/components/core/Skeleton";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function SkeletonMotionControllerPlayRegionDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("region", "hoverIn")}>
          playSlot(region)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("region", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("region", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Skeleton.Region
        aria-label="Profile"
        className="flex flex-col gap-small"
        motionController={controller}
        motion={{
          region: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-32" />
      </Skeleton.Region>
    </div>
  );
}
