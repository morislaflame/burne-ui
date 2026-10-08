import { useState } from "react";

import { Stepper } from "@/components/core/Stepper";

import { checkoutSteps } from "./steps";

export function StepperCheckoutDemo() {
  const [value, setValue] = useState("shipping");

  return (
    <Stepper
      aria-label="Checkout"
      steps={[...checkoutSteps]}
      value={value}
      onValueChange={setValue}
    />
  );
}
