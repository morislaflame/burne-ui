import { TextArea } from "@/components/core/TextArea";

export function TextAreaGlossDemo() {
  return (
    <TextArea
      label="Комментарий"
      variant="gloss"
      placeholder="Текст сообщения…"
      rows={3}
      hint="Стеклянная оболочка поля."
      className="w-64"
    />
  );
}
