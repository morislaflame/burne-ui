import { Stepper } from "@/components/core/Stepper";

import { checkoutSteps } from "./steps";

const SIZES = ["small", "base", "mid", "large"] as const;

export function StepperSizesDemo() {
  return (
    <div className="flex w-full flex-col gap-xlarge">
      {SIZES.map((size) => (
        <Stepper
          key={size}
          size={size}
          aria-label={size}
          defaultValue="shipping"
          steps={[...checkoutSteps]}
        />
      ))}
    </div>
  );
}
