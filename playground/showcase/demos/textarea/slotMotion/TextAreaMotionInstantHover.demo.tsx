import { TextArea } from "@/components/core/TextArea";

export function TextAreaMotionInstantHoverDemo() {
  return (
    <TextArea
      className="w-full max-w-md"
      label="Instant hover"
      rows={3}
      placeholder="Hover — lift skipped"
      hint="shell.hoverIn / hoverOut: false"
      motion={{
        shell: { hoverIn: false, hoverOut: false },
      }}
    />
  );
}
