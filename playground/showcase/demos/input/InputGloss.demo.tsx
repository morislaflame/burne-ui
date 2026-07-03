import { Input } from "@/components/core/Input";

export function InputGlossDemo() {
  return (
    <Input
      label="Email"
      variant="gloss"
      placeholder="you@example.com"
      hint="Glass shell field."
      className="w-64"
    />
  );
}
