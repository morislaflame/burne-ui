import { useEffect } from "react";

import { Button } from "@/components/core/Button";
import { PinInput } from "@/components/core/PinInput";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function PinInputMotionPlayPartsDemo() {
  const controller = useMotionControllerHandle();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      controller.playSlot("group", "enter");
    });
    return () => cancelAnimationFrame(frame);
  }, [controller]);

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("group", "enter")}>
        Play
      </Button>
      <PinInput
        label="Code"
        hint="Six digits"
        error="Wrong code"
        length={4}
        motionController={controller}
        motion={{
          group: {
            enter: (ctx) => {
              const tl = ctx.timeline();
              const steps: Array<{ el: HTMLElement | null; y: number }> = [
                { el: ctx.targets.label, y: 10 },
                { el: ctx.el, y: 12 },
              ];
              let at = 0;
              for (const step of steps) {
                if (!step.el) continue;
                tl.fromTo(step.el, { opacity: 0, y: step.y }, { opacity: 1, y: 0, duration: 0.34 }, at);
                at += 0.1;
              }
              for (const el of ctx.getTargets("field")) {
                tl.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.34 }, at);
                at += 0.08;
              }
              for (const el of [ctx.targets.hint, ctx.targets.error]) {
                if (!el) continue;
                tl.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.34 }, at);
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
