import { Input } from "@/components/core/Input";

export function InputMotionInstantHoverDemo() {
  return (
    <Input
      className="w-full max-w-sm"
      label="Instant hover"
      placeholder="Hover — lift skipped"
      hint="shell.hoverIn / hoverOut: false"
      motion={{
        shell: { hoverIn: false, hoverOut: false },
      }}
    />
  );
}
