import { TextArea } from "@/components/core/TextArea";

export function TextAreaBasicDemo() {
  return (
    <TextArea
      label="Комментарий"
      placeholder="Текст сообщения…"
      rows={3}
      hint="До 500 символов."
      className="w-64"
    />
  );
}
