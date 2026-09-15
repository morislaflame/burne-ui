import { Button } from "@/components/core/Button";
import { ComboBox } from "@/components/core/ComboBox";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

const events = createMotionEvents({
  "combo:kick": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -6, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.input) {
      tl.fromRest(ctx.targets.input, { y: -8, duration: 0.18 }, 0);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.input) {
      tl.to(ctx.targets.input, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function ComboBoxMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("inputGroup", "combo:kick")}>
        Kick
      </Button>
      <ComboBox
        label="Framework"
        options={options}
        defaultValue="react"
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
