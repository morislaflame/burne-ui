import { Select } from "@/components/core/Select";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const items = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

const events = createMotionEvents({
  "select:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function ValuePulse() {
  const controller = useMotionController();
  return (
    <Select.Value onPointerEnter={() => controller.playSlot("value", "select:nudge")} />
  );
}

export function SelectMotionControllerInsideDemo() {
  return (
    <div className="w-full max-w-sm">
      <Select items={items} defaultValue="react" motion={{ events }}>
        <Select.Label>Hover the value</Select.Label>
        <Select.Shell>
          <ValuePulse />
          <Select.Trigger />
        </Select.Shell>
        <Select.Popover />
      </Select>
    </div>
  );
}
