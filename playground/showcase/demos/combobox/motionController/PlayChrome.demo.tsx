import { Button } from "@/components/core/Button";
import { ComboBox } from "@/components/core/ComboBox";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const items = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function ComboBoxMotionControllerPlayChromeDemo() {
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
      <ComboBox
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
        <ComboBox.Label>Framework</ComboBox.Label>
        <ComboBox.Shell>
          <ComboBox.Input />
          <ComboBox.Trigger />
        </ComboBox.Shell>
        <ComboBox.Popover />
        <ComboBox.Hint>Root chrome scope — not the InputGroup host.</ComboBox.Hint>
      </ComboBox>
    </div>
  );
}
