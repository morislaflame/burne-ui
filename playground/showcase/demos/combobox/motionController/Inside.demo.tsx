import { ComboBox } from "@/components/core/ComboBox";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const items = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

const events = createMotionEvents({
  "combo:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function InputPulse() {
  const controller = useMotionController();
  return (
    <ComboBox.Input onPointerEnter={() => controller.playSlot("input", "combo:nudge")} />
  );
}

export function ComboBoxMotionControllerInsideDemo() {
  return (
    <div className="w-full max-w-sm">
      <ComboBox items={items} defaultValue="react" motion={{ events }}>
        <ComboBox.Label>Hover the input</ComboBox.Label>
        <ComboBox.Shell>
          <InputPulse />
          <ComboBox.Trigger />
        </ComboBox.Shell>
        <ComboBox.Popover />
      </ComboBox>
    </div>
  );
}
