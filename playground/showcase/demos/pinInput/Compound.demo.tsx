import { PinInput } from "@/components/core/PinInput";

export function PinInputCompoundDemo() {
  return (
    <PinInput length={6} separator="–" hint="Check the message">
      <PinInput.Label>Verification code</PinInput.Label>
      <PinInput.Hint />
      <PinInput.Group />
    </PinInput>
  );
}
