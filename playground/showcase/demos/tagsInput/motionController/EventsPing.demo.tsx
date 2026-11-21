import { Button } from "@/components/core/Button";
import { TagsInput } from "@/components/core/TagsInput";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "tag:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function TagsInputMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex w-full max-w-xs flex-col gap-2xlarge">
      <Button size="small" variant="outline" type="button" onClick={() => controller.playSlot("tag", "tag:nudge")}>
        Nudge
      </Button>
      <TagsInput
        label="Topics"
        defaultValues={["design", "react"]}
        placeholder="Add a tag"
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
