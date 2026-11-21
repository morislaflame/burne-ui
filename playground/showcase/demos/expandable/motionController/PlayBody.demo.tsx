import { Button } from "@/components/core/Button";
import { Expandable } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ExpandableMotionControllerPlayBodyDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("panel", "enter")}>
          Pulse panel
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("panel", "leave")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("panel", { y: 0, opacity: 1 })}>
          Snap
        </Button>
      </div>
      <Expandable
        className="max-w-lg"
        title="Panel slot"
        motionController={controller}
        motion={{
          panel: {
            enter: { y: -6, duration: 0.28, replay: "rest" },
            leave: { y: 0, duration: 0.2 },
          },
        }}
      >
        <Text as="p" textStyle="small" className="text-muted">
          playSlot on `panel`. Open the panel to see it.
        </Text>
      </Expandable>
    </div>
  );
}
