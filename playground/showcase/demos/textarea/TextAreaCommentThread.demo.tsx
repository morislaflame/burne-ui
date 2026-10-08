import { TextArea } from "@/components/core/TextArea";
import { Text } from "@/components/core/Text";

export function TextAreaCommentThreadDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-small">
      <div className="rounded-large border-token bg-secondary px-large py-small w-fit self-end">
        <Text as="p" variant="base" className="text-muted">
          Alex: “Can I restyle SearchInput?”
        </Text>
      </div>
      <TextArea
        label="Answer"
        placeholder="Write a comment…"
        rows={2}
        variant="default"
        className="w-full"
      />
    </div>
  );
}
