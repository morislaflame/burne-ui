import { Button } from "@/components/core/Button";
import { Select } from "@/components/core/Select";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const items = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function SelectMotionControllerPlayChromeDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("label", "hoverIn")}>
          playSlot(label)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("hint", "hoverIn")}>
          playSlot(hint)
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Select
        items={items}
        defaultValue="react"
        motionController={controller}
        motion={{
          label: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          hint: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <Select.Label>Framework</Select.Label>
        <Select.Shell>
          <Select.Value />
          <Select.Trigger />
        </Select.Shell>
        <Select.Popover />
        <Select.Hint>Root chrome scope — not the TriggerGroup host.</Select.Hint>
      </Select>
    </div>
  );
}
