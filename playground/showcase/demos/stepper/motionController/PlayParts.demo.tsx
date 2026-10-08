import { useEffect } from "react";

import { Button } from "@/components/core/Button";
import { Stepper } from "@/components/core/Stepper";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { checkoutSteps } from "../steps";

const slots = ["indicator", "title", "description", "separator"] as const;

export function StepperMotionPlayPartsDemo() {
  const controller = useMotionControllerHandle();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      controller.playSlot("root", "enter");
    });
    return () => cancelAnimationFrame(frame);
  }, [controller]);

  return (
    <div className="flex w-full flex-col gap-2xlarge">
      <Button size="small" variant="outline" type="button" onClick={() => controller.playSlot("root", "enter")}>
        Play
      </Button>
      <Stepper
        aria-label="Checkout"
        defaultValue="shipping"
        steps={[...checkoutSteps]}
        motionController={controller}
        motion={{
          root: {
            enter: (ctx) => {
              const tl = ctx.timeline();
              let at = 0;
              for (const slot of slots) {
                for (const el of ctx.getTargets(slot)) {
                  tl.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.28 }, at);
                  at += 0.05;
                }
              }
              return tl;
            },
          },
        }}
      />
    </div>
  );
}
