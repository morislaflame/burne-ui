import { Alert } from "@/components/core/Alert";

export function AlertGlossDemo() {
  return (
    <div className="flex flex-col gap-mid">
      <Alert
        variant="gloss"
        status="info"
        title="Gloss alert"
        description="Стеклянная панель с hover-lift."
      />
      <Alert
        variant="gloss"
        status="danger"
        title="Gloss danger"
        description="Статус — цвет текста и иконки."
      />
    </div>
  );
}
