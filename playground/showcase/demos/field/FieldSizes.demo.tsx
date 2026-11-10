import { Field, type FieldSize } from "@/components/core/Field";
import { Input } from "@/components/core/Input";

const SIZES: FieldSize[] = ["small", "base", "mid", "large"];

export function FieldSizesDemo() {
  return (
    <div className="grid w-full gap-2xlarge lg:grid-cols-2">
      {SIZES.map((size) => (
        <Field.Set key={size} size={size} className="max-w-md">
          <Field.Legend>
            <Field.LegendHeader>
              <Field.Label>size="{size}"</Field.Label>
              <Field.Hint as="span">
                Set gaps + Label / Hint type. Input stays at its own size.
              </Field.Hint>
            </Field.LegendHeader>
          </Field.Legend>
          <Field.Group>
            <Input label="Name" placeholder="Ivan" />
            <Input label="Email" placeholder="you@example.com" hint="Work email preferred" />
          </Field.Group>
        </Field.Set>
      ))}
    </div>
  );
}
