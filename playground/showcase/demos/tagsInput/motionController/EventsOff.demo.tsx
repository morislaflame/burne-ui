import { Button } from "@/components/core/Button";
import { TagsInput } from "@/components/core/TagsInput";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "tag:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "tag:nudge": false });

export function TagsInputMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex w-full max-w-xs flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" type="button" onClick={() => liveController.playSlot("tag", "tag:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" type="button" onClick={() => offController.playSlot("tag", "tag:nudge")}>
          Off nudge
        </Button>
      </div>
      <TagsInput label="Live" defaultValues={["design"]} placeholder="Add a tag" motionController={liveController} motion={{ events: live }} />
      <TagsInput label="Off" defaultValues={["design"]} placeholder="Add a tag" motionController={offController} motion={{ events: off }} />
    </div>
  );
}
