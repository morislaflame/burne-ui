import { DatePicker } from "@/components/core/DatePicker";

const VARIANTS = ["default", "outline", "secondary"] as const;

export function DatePickerVariantsDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-xlarge sm:grid-cols-2">
      {VARIANTS.map((variant) => (
        <DatePicker
          key={variant}
          label={variant}
          variant={variant}
          hint={`variant="${variant}"`}
          className="w-full"
        />
      ))}
    </div>
  );
}
