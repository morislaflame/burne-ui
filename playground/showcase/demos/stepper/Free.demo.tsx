import { useState } from "react";

import { Stepper } from "@/components/core/Stepper";

import { checkoutSteps } from "./steps";

export function StepperFreeDemo() {
  const [value, setValue] = useState("account");

  return (
    <Stepper
      aria-label="Checkout"
      linear={false}
      steps={[...checkoutSteps]}
      value={value}
      onValueChange={setValue}
    />
  );
}
