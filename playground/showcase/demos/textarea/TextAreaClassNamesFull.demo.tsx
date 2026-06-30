import { TextArea } from "@/components/core/TextArea";

export function TextAreaClassNamesFullDemo() {
  return (
    <TextArea
      className="max-w-md"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        shell: "ring-1 ring-primary/15",
        control: "text-primary placeholder:text-primary/50",
        hint: "text-foreground/70",
        error: "font-medium",
      }}
      label="Комментарий"
      placeholder="Ваш отзыв…"
      rows={3}
      status="danger"
      hint="До 500 символов."
      error="Текст слишком короткий."
    />
  );
}

export function TextAreaClassNamesCompoundDemo() {
  return (
    <TextArea
      className="max-w-md"
      classNames={{
        root: "rounded-mid border border-info/25 p-base",
        shell: "border-info/30 bg-info/5",
        control: "text-info placeholder:text-info/50",
        resizeHandle: "text-info",
        hint: "text-info/80",
      }}
    >
      <TextArea.Label>Описание</TextArea.Label>
      <TextArea.Control placeholder="Кратко о задаче…" rows={2} />
      <TextArea.Hint>Слоты shell, control и resizeHandle через classNames.</TextArea.Hint>
    </TextArea>
  );
}
