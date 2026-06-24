import { TextArea } from "@/components/core/TextArea";
import { Text } from "@/components/core/Text";

export function TextAreaSupportTicketDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-mid rounded-mid border border-warning/25 bg-warning/5 p-mid">
      <div>
        <Text as="p" variant="base" className="font-medium text-warning">
          Нужна помощь?
        </Text>
        <Text as="p" variant="small" className="text-muted">
          Опишите проблему — ответим в течение рабочего дня.
        </Text>
      </div>
      <TextArea isRequired>
        <TextArea.Label>Сообщение</TextArea.Label>
        <TextArea.Control rows={3} placeholder="Что пошло не так…" />
        <TextArea.Hint>Укажите шаги воспроизведения и ожидаемый результат.</TextArea.Hint>
      </TextArea>
    </div>
  );
}
