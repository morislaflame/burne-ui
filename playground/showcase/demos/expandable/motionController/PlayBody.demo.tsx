import { Button } from "@/components/core/Button";
import { Expandable } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ExpandableMotionControllerPlayBodyDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("body", "enter")}>
          Pulse body
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("body", "leave")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("body", { y: 0, opacity: 1 })}>
          Snap
        </Button>
      </div>
      <Expandable
        className="max-w-lg"
        title="Body slot"
        motionController={controller}
        motion={{
          body: {
            enter: { y: -6, duration: 0.28, replay: "rest" },
            leave: { y: 0, duration: 0.2 },
          },
        }}
      >
        <Text as="p" variant="small" className="text-muted">
          playSlot on `body`. Open the panel to see it.
        </Text>
      </Expandable>
    </div>
  );
}
