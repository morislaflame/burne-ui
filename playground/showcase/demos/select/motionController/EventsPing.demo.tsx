import { Button } from "@/components/core/Button";
import { Select } from "@/components/core/Select";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

const events = createMotionEvents({
  "select:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function SelectMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("triggerGroup", "select:nudge")}>
        Nudge
      </Button>
      <Select
        label="Framework"
        options={options}
        defaultValue="react"
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
