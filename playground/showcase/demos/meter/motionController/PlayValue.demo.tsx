import { Button } from "@/components/core/Button";
import { Meter } from "@/components/core/Meter";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function MeterMotionControllerPlayValueDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("value", "hoverIn")}>
          playSlot(value)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("label", "hoverIn")}>
          playSlot(label)
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Meter
        value={62}
        showValue
        motionController={controller}
        motion={{
          label: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          value: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <Meter.Header>
          <Meter.Label>Storage</Meter.Label>
          <Meter.Value />
        </Meter.Header>
        <Meter.Track value={62} />
      </Meter>
    </div>
  );
}
