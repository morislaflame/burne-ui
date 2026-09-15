import { Button } from "@/components/core/Button";
import { TextArea } from "@/components/core/TextArea";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "area:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function TextAreaMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "area:nudge")}>
        Nudge
      </Button>
      <TextArea
        label="Note"
        placeholder="Write a note…"
        rows={2}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
