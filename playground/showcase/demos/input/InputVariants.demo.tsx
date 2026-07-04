import { Input } from "@/components/core/Input";

export function InputVariantsDemo() {
  return (
    <div className="flex flex-col gap-mid items-center w-full">
      <Input
        label="Email"
        placeholder="you@example.com"
        hint="We do not send spam."
        className="w-64"
      />
      <Input
        label="Outline"
        variant="outline"
        placeholder="variant outline"
        hint="Transparent background with outline."
        className="w-64"
      />
      <Input
        label="Secondary"
        variant="secondary"
        placeholder="variant secondary"
        hint="Secondary surface — like Button secondary."
        className="w-64"
      />
    </div>
  );
}
