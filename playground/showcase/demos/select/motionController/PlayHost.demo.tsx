import { Button } from "@/components/core/Button";
import { Select } from "@/components/core/Select";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function SelectMotionControllerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("triggerGroup", "hoverIn")}>
          Pulse
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("triggerGroup", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("triggerGroup", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Select
        label="Framework"
        options={options}
        defaultValue="react"
        motionController={controller}
        motion={{
          triggerGroup: {
            hoverIn: { y: -4, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      />
    </div>
  );
}
