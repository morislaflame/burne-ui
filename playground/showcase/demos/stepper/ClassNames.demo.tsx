import { useState } from "react";

import { Stepper } from "@/components/core/Stepper";

import { checkoutSteps } from "./steps";

export function StepperClassNamesDemo() {
  const [value, setValue] = useState("shipping");

  return (
    <Stepper
      aria-label="Checkout"
      steps={[...checkoutSteps]}
      value={value}
      onValueChange={setValue}
      classNames={{
        indicator: "border-token-primary",
        title: "text-primary",
        description: "text-muted",
        separator: "bg-primary/40",
      }}
    />
  );
}
