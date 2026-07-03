import { TextArea } from "@/components/core/TextArea";

export function TextAreaWithErrorDemo() {
  return (
    <TextArea
      label="With an error"
      status="danger"
      defaultValue="The text is too short"
      error="Minimum 20 characters."
      rows={2}
      className="w-64"
    />
  );
}
