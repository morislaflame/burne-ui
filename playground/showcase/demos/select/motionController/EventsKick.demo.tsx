import { Button } from "@/components/core/Button";
import { Select } from "@/components/core/Select";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

const events = createMotionEvents({
  "select:kick": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -6, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.value) {
      tl.fromRest(ctx.targets.value, { y: -8, duration: 0.18 }, 0);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.value) {
      tl.to(ctx.targets.value, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function SelectMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("triggerGroup", "select:kick")}>
        Kick
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
