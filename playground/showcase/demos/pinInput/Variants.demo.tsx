import { PinInput } from "@/components/core/PinInput";

const VARIANTS = ["default", "outline", "secondary"] as const;

export function PinInputVariantsDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-xlarge sm:grid-cols-2">
      {VARIANTS.map((variant) => (
        <PinInput
          key={variant}
          label={variant}
          variant={variant}
          hint={`variant="${variant}"`}
          length={4}
          name={`pin-${variant}`}
        />
      ))}
    </div>
  );
}
