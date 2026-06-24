import { Input } from "@/components/core/Input";

export function InputGlossDemo() {
  return (
    <Input
      label="Email"
      variant="gloss"
      placeholder="you@example.com"
      hint="Стеклянная оболочка поля."
      className="w-64"
    />
  );
}
