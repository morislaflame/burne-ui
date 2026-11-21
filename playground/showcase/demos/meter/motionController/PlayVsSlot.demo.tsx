import { Button } from "@/components/core/Button";
import { Meter } from "@/components/core/Meter";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function MeterMotionControllerPlayVsSlotDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "hoverIn")}>
          playSlot(track)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("fill", "hoverIn")}>
          playSlot(fill)
        </Button>
        <Button size="small" variant="outline" onClick={() => void controller.playAll("hoverIn")}>
          playAll()
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Meter
        label="Storage"
        showValue
        value={62}
        motionController={controller}
        motion={{
          track: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          fill: {
            hoverIn: (ctx) => ctx.fromRest({ opacity: 0.45, duration: 0.22 }),
            hoverOut: (ctx) => ctx.to({ opacity: 1, duration: 0.16 }),
          },
        }}
      />
    </div>
  );
}
