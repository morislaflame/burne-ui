import { Button } from "@/components/core/Button";
import { Expandable } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "faq:nudge": { x: 8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function ExpandableMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("title", "faq:nudge")}>
        Nudge
      </Button>
      <Expandable
        className="max-w-lg"
        title="faq:nudge"
        motionController={controller}
        motion={{ events }}
      >
        <Text as="p" variant="small" className="text-muted">
          Namespaced event on motion.events — not an open/close phase.
        </Text>
      </Expandable>
    </div>
  );
}
