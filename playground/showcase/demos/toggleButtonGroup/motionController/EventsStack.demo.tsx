import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { Button } from "@/components/core/Button";
import { ToggleButton } from "@/components/core/ToggleButton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "group:stack": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -10, duration: 0.18, ease: "power2.out" }, 0);
    tl.to(ctx.el, { scale: 1.03, duration: 0.16, ease: "back.out(1.8)" }, 0.1);
    tl.to(ctx.el, { y: 0, scale: 1, duration: 0.24, ease: "power2.inOut" }, 0.32);
    return tl;
  },
});

export function ToggleButtonGroupMotionEventsStackDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("group:stack")}>
        Stack
      </Button>
      <ToggleButtonGroup
        type="single"
        defaultValue="list"
        aria-label="View"
        motionController={controller}
        motion={{ events }}
      >
        <ToggleButton value="list">List</ToggleButton>
        <ToggleButton value="grid">Grid</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
