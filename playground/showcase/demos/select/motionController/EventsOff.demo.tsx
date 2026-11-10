import { Button } from "@/components/core/Button";
import { Select } from "@/components/core/Select";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const items = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

const live = createMotionEvents({
  "select:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "select:nudge": false });

export function SelectMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("shell", "select:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("shell", "select:nudge")}>
          Off nudge
        </Button>
      </div>
      <Select
        label="Live"
        items={items}
        defaultValue="react"
        motionController={liveController}
        motion={{ events: live }}
      />
      <Select
        label="Off"
        items={items}
        defaultValue="svelte"
        motionController={offController}
        motion={{ events: off }}
      />
    </div>
  );
}
