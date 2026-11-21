import { useEffect } from "react";

import { Button } from "@/components/core/Button";
import { NumberInput } from "@/components/core/NumberInput";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function NumberInputMotionPlayPartsDemo() {
  const controller = useMotionControllerHandle();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      controller.playSlot("shell", "enter");
    });
    return () => cancelAnimationFrame(frame);
  }, [controller]);

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "enter")}>
        Play
      </Button>
      <NumberInput
        label="Quantity"
        hint="Whole units"
        error="Too many"
        defaultValue={1}
        motionController={controller}
        motion={{
          shell: {
            enter: (ctx) => {
              const tl = ctx.timeline();
              const steps: Array<{ el: HTMLElement | null; x: number; y: number }> = [
                { el: ctx.targets.label, x: 0, y: 10 },
                { el: ctx.el, x: 0, y: 16 },
                { el: ctx.targets.decrement, x: 12, y: 0 },
                { el: ctx.targets.control, x: 0, y: 8 },
                { el: ctx.targets.increment, x: -12, y: 0 },
                { el: ctx.targets.hint, x: 0, y: 10 },
                { el: ctx.targets.error, x: 0, y: 10 },
              ];
              let at = 0;
              for (const step of steps) {
                if (!step.el) continue;
                tl.fromTo(
                  step.el,
                  { opacity: 0, x: step.x, y: step.y },
                  { opacity: 1, x: 0, y: 0, duration: 0.34 },
                  at,
                );
                at += 0.1;
              }
              return tl;
            },
          },
        }}
      />
    </div>
  );
}
