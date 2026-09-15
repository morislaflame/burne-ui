import { Button } from "@/components/core/Button";
import { Expandable } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ExpandableMotionControllerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("title", "enter")}>
          Pulse title
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("title", "leave")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("title", { x: 0 })}>
          Snap
        </Button>
      </div>
      <Expandable
        className="max-w-lg"
        title="Title slot"
        motionController={controller}
        motion={{
          title: {
            enter: { x: 8, duration: 0.28, replay: "rest" },
            leave: { x: 0, duration: 0.2 },
          },
        }}
      >
        <Text as="p" variant="small" className="text-muted">
          playSlot on `title` from a handle outside Expandable.
        </Text>
      </Expandable>
    </div>
  );
}
