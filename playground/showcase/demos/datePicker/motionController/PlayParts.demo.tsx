import { useEffect } from "react";

import { Button } from "@/components/core/Button";
import { DatePicker } from "@/components/core/DatePicker";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function DatePickerMotionPlayPartsDemo() {
  const controller = useMotionControllerHandle();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      controller.playSlot("trigger", "enter");
    });
    return () => cancelAnimationFrame(frame);
  }, [controller]);

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("trigger", "enter")}>
        Play
      </Button>
      <DatePicker
        label="Date"
        hint="One day"
        error="Pick a day"
        motionController={controller}
        motion={{
          trigger: {
            enter: (ctx) => {
              const tl = ctx.timeline();
              const steps: Array<{ el: HTMLElement | null; y: number }> = [
                { el: ctx.targets.label, y: 10 },
                { el: ctx.el, y: 16 },
                { el: ctx.targets.icon, y: 8 },
                { el: ctx.targets.hint, y: 10 },
                { el: ctx.targets.error, y: 10 },
              ];
              let at = 0;
              for (const step of steps) {
                if (!step.el) continue;
                tl.fromTo(
                  step.el,
                  { opacity: 0, y: step.y },
                  { opacity: 1, y: 0, duration: 0.34 },
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
