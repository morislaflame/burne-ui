import { Stepper } from "@/components/core/Stepper";

import { checkoutSteps } from "../steps";

export function StepperMotionNudgeDemo() {
  return (
    <Stepper
      aria-label="Checkout"
      defaultValue="shipping"
      steps={[...checkoutSteps]}
      motion={{
        indicator: {
          hoverIn: (ctx) => ctx.fromRest({ y: -4, yoyo: true, repeat: 1, duration: 0.18 }),
          hoverOut: false,
        },
      }}
    />
  );
}
