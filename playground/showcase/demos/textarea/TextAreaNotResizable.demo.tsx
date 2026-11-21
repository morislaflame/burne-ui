import { TextArea } from "@/components/core/TextArea";

export function TextAreaNotResizableDemo() {
  return (
    <TextArea
      label="Fixed height"
      placeholder="Drag resize is off…"
      rows={3}
      resizable={false}
      hint="resizable={false} — no drag handle."
      className="w-64"
    />
  );
}
