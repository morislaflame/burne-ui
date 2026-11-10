import { useState } from "react";

import { Stepper } from "@/components/core/Stepper";

export function StepperCompoundDemo() {
  const [value, setValue] = useState("shipping");

  return (
    <Stepper aria-label="Checkout" value={value} onValueChange={setValue}>
      <Stepper.Item value="account">
        <Stepper.Indicator />
        <Stepper.Title>Account</Stepper.Title>
        <Stepper.Description>Email and password</Stepper.Description>
      </Stepper.Item>
      <Stepper.Item value="shipping">
        <Stepper.Indicator />
        <Stepper.Title>Shipping</Stepper.Title>
        <Stepper.Description>Delivery address</Stepper.Description>
      </Stepper.Item>
      <Stepper.Item value="payment">
        <Stepper.Indicator />
        <Stepper.Title>Payment</Stepper.Title>
        <Stepper.Description>Card on file</Stepper.Description>
      </Stepper.Item>
    </Stepper>
  );
}
