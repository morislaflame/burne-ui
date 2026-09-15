import { Button } from "@/components/core/Button";
import { ComboBox } from "@/components/core/ComboBox";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

const live = createMotionEvents({
  "combo:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "combo:nudge": false });

export function ComboBoxMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("inputGroup", "combo:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("inputGroup", "combo:nudge")}>
          Off nudge
        </Button>
      </div>
      <ComboBox
        label="Live"
        options={options}
        defaultValue="react"
        motionController={liveController}
        motion={{ events: live }}
      />
      <ComboBox
        label="Off"
        options={options}
        defaultValue="svelte"
        motionController={offController}
        motion={{ events: off }}
      />
    </div>
  );
}
