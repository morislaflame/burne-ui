import { Stepper } from "@/components/core/Stepper";

import { checkoutSteps } from "../steps";

const slots = ["indicator", "title", "description", "separator"] as const;

export function StepperMotionAppearDemo() {
  return (
    <Stepper
      aria-label="Checkout"
      defaultValue="shipping"
      steps={[...checkoutSteps]}
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
  );
}
