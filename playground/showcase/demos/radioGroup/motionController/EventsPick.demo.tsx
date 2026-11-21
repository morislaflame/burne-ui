import { RadioGroup } from "@/components/composite/RadioGroup";
import { Button } from "@/components/core/Button";
import { Radio } from "@/components/core/Radio";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { Label } from "@/components/core/Label";

const events = createMotionEvents({
  "choice:pick": (ctx) => {
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

export function RadioGroupMotionEventsPickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("choice:pick")}>
        Pick
      </Button>
      <RadioGroup aria-label="Shipping" motionController={controller} motion={{ events }}>
        <RadioGroup.Legend>
          <Label>Shipping</Label>
          <RadioGroup.Hint>Pick hits legend and list via ctx.targets.</RadioGroup.Hint>
        </RadioGroup.Legend>
        <RadioGroup.List>
          <Radio value="ground" label="Ground" />
          <Radio value="air" label="Air" />
        </RadioGroup.List>
      </RadioGroup>
    </div>
  );
}
