import { PinInput } from "@/components/core/PinInput";

export function PinInputAlphanumericDemo() {
  return <PinInput label="Room code" hint="Letters and digits" type="text" length={4} />;
}
