import { TextArea } from "@/components/core/TextArea";
import { Text } from "@/components/core/Text";

export function TextAreaSupportTicketDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-large rounded-mid border border-warning/25 bg-warning/5 p-large">
      <div>
        <Text as="p" variant="base" className="font-medium text-warning">
          Need help?
        </Text>
        <Text as="p" variant="small" className="text-muted">
          Describe the problem - we will respond within one business day.
        </Text>
      </div>
      <TextArea required>
        <TextArea.Label>Message</TextArea.Label>
        <TextArea.Control rows={3} placeholder="What went wrong…" />
        <TextArea.Hint>Specify reproduction steps and expected result.</TextArea.Hint>
      </TextArea>
    </div>
  );
}
