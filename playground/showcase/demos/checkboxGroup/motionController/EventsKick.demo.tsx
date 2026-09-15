import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "checks:kick": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -6, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.legend) {
      tl.fromRest(ctx.targets.legend, { y: -8, duration: 0.18 }, 0);
    }
    if (ctx.targets.list) {
      tl.fromRest(ctx.targets.list, { y: -10, duration: 0.18 }, 0.04);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.legend) {
      tl.to(ctx.targets.legend, { y: 0, duration: 0.22 }, 0.22);
    }
    if (ctx.targets.list) {
      tl.to(ctx.targets.list, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function CheckboxGroupMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("checks:kick")}>
        Kick
      </Button>
      <CheckboxGroup motionController={controller} motion={{ events }}>
        <CheckboxGroup.Legend>
          <CheckboxGroup.Label>Plan</CheckboxGroup.Label>
          <CheckboxGroup.Hint>Kick hits legend + list via ctx.targets.</CheckboxGroup.Hint>
        </CheckboxGroup.Legend>
        <CheckboxGroup.List>
          <Checkbox value="pro" label="Pro" />
          <Checkbox value="team" label="Team" />
        </CheckboxGroup.List>
      </CheckboxGroup>
    </div>
  );
}
