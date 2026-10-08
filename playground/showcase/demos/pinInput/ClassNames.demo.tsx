import { PinInput } from "@/components/core/PinInput";

export function PinInputClassNamesDemo() {
  return (
    <PinInput
      label="Verification code"
      defaultValue="123"
      length={6}
      classNames={{
        label: "font-w-mid",
        group: "gap-mid",
        field: "bg-primary-tint",
        separator: "text-primary",
      }}
      separator="–"
    />
  );
}
