import { Button } from "@/components/core/Button";
import { ComboBox } from "@/components/core/ComboBox";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const items = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

const events = createMotionEvents({
  "combo:pulse": (ctx) =>
    ctx.fromRest({
      y: -4,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function ComboBoxMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "combo:pulse")}>
          Loop
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            controller.cancel("shell");
            controller.set("shell", { y: 0 });
          }}
        >
          Cancel
        </Button>
      </div>
      <ComboBox
        label="Framework"
        items={items}
        defaultValue="react"
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
