import { Button } from "@/components/core/Button";
import { Stepper } from "@/components/core/Stepper";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { checkoutSteps } from "../steps";

export function StepperMotionPlayIndicatorDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex w-full flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" type="button" onClick={() => controller.playSlot("indicator", "hoverIn")}>
          Nudge
        </Button>
        <Button size="small" variant="ghost" type="button" onClick={() => controller.set("indicator", { y: 0 })}>
          Reset
        </Button>
      </div>
      <Stepper
        aria-label="Checkout"
        defaultValue="shipping"
        steps={[...checkoutSteps]}
        motionController={controller}
        motion={{
          indicator: {
            hoverIn: (ctx) => ctx.fromRest({ y: -6, yoyo: true, repeat: 1, duration: 0.2 }),
            hoverOut: false,
          },
        }}
      />
    </div>
  );
}
