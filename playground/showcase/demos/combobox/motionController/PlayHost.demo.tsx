import { Button } from "@/components/core/Button";
import { ComboBox } from "@/components/core/ComboBox";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const items = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function ComboBoxMotionControllerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "hoverIn")}>
          Pulse
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("shell", { y: 0 })}>
          Snap
        </Button>
      </div>
      <ComboBox
        label="Framework"
        items={items}
        defaultValue="react"
        motionController={controller}
        motion={{
          shell: {
            hoverIn: { y: -4, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      />
    </div>
  );
}
