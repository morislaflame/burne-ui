import { NumberInput } from "@/components/core/NumberInput";

const VARIANTS = ["default", "outline", "secondary"] as const;

export function NumberInputVariantsDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-xlarge sm:grid-cols-2">
      {VARIANTS.map((variant) => (
        <NumberInput
          key={variant}
          label={variant}
          variant={variant}
          hint={`variant="${variant}"`}
          min={0}
          defaultValue={1}
          className="w-full"
        />
      ))}
    </div>
  );
}
