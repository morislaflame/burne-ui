import { Input } from "@/components/core/Input";

export function InputClassNamesFullDemo() {
  return (
    <Input
      className="max-w-sm"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        shell: "ring-1 ring-primary/15",
        control: "text-primary placeholder:text-primary/50",
        hint: "text-foreground/70",
        error: "font-medium",
      }}
      label="Email"
      placeholder="you@example.com"
      status="danger"
      hint="We do not share the address with third parties."
      error="Please enter correct email."
    />
  );
}

export function InputClassNamesCompoundDemo() {
  return (
    <Input
      className="max-w-sm"
      classNames={{
        root: "rounded-mid border border-info/25 p-base",
        shell: "border-info/30 bg-info/5",
        prefix: "text-info",
        suffix: "text-info",
        hint: "text-info/80",
      }}
    >
      <Input.Label>Domain</Input.Label>
      <Input.Control prefix="https://" suffix=".com" placeholder="example" />
      <Input.Hint>Slots prefix, suffix and shell through classNames.</Input.Hint>
    </Input>
  );
}
