import { PinInput } from "@/components/core/PinInput";

export function PinInputControlDemo() {
  return (
    <PinInput length={4} label="Code" separator="–">
      <PinInput.Shell>
        <PinInput.Control className="border-primary" />
        <PinInput.Control />
        <PinInput.Control />
        <PinInput.Control className="border-primary" />
      </PinInput.Shell>
    </PinInput>
  );
}
