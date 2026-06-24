import { TextArea } from "@/components/core/TextArea";
import { Text } from "@/components/core/Text";

export function TextAreaCommentThreadDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-small">
      <div className="rounded-mid border-token bg-secondary px-mid py-small">
        <Text as="p" variant="small" className="text-muted">
          Алекс: «Можно добавить gloss на SearchInput?»
        </Text>
      </div>
      <TextArea
        label="Ответ"
        placeholder="Напишите комментарий…"
        rows={2}
        variant="gloss"
        className="w-full"
      />
    </div>
  );
}
