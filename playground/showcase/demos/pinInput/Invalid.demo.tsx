import { PinInput } from "@/components/core/PinInput";

export function PinInputInvalidDemo() {
  return <PinInput label="Verification code" defaultValue="000000" error="Wrong code" />;
}
