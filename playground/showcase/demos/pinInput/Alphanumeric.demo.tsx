import { PinInput } from "@/components/core/PinInput";

export function PinInputAlphanumericDemo() {
  return <PinInput label="Room code" hint="Letters and digits" charset="text" length={4} />;
}
