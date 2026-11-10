import { PinInput } from "@/components/core/PinInput";

export function PinInputSeparatorDemo() {
  return <PinInput label="Pairing code" hint="Three and three" separator="–" length={6} />;
}
