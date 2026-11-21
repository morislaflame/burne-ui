import { useState } from "react";

import { Stepper } from "@/components/core/Stepper";

import { checkoutSteps } from "./steps";

export function StepperVerticalDemo() {
  const [value, setValue] = useState("shipping");

  return (
    <Stepper
      aria-label="Checkout"
      orientation="vertical"
      className="max-w-component-small"
      steps={[...checkoutSteps]}
      value={value}
      onValueChange={setValue}
    />
  );
}
