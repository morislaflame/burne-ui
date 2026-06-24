import { TextArea } from "@/components/core/TextArea";

export function TextAreaWithErrorDemo() {
  return (
    <TextArea
      label="С ошибкой"
      status="danger"
      defaultValue="Слишком короткий текст"
      error="Минимум 20 символов."
      rows={2}
      className="w-64"
    />
  );
}
