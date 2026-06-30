import { Input } from "@/components/core/Input";
import { Label } from "@/components/core/Label";

export function LabelClassNamesFullDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-xsmall">
      <Label
        htmlFor="label-demo-email"
        isRequired
        classNames={{
          text: "text-primary font-semibold",
          required: "text-warning",
        }}
      >
        Email
      </Label>
      <Input.Control id="label-demo-email" placeholder="you@example.com" />
    </div>
  );
}
