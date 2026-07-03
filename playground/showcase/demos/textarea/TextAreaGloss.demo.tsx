import { TextArea } from "@/components/core/TextArea";

export function TextAreaGlossDemo() {
  return (
    <TextArea
      label="Comment"
      variant="gloss"
      placeholder="Message text…"
      rows={3}
      hint="Glass shell field."
      className="w-64"
    />
  );
}
