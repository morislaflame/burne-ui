import { PinInput } from "@/components/core/PinInput";

export function PinInputMaskDemo() {
  return <PinInput label="PIN" hint="Hidden as you type" mask length={4} />;
}
