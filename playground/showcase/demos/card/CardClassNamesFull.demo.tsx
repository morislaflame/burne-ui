import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { Text } from "@/components/core/Text";

export function CardClassNamesFullDemo() {
  return (
    <Card
      variant="secondary"
      classNames={{
        root: "rounded-large border-info/40 shadow-token-mid",
        header: "gap-mid",
        title: "text-info font-semibold",
        description: "text-foreground/75",
        body: "pt-small",
        footer: "border-info/30",
      }}
      className="max-w-md"
    >
      <Card.Header>
        <Card.Title>Уведомления</Card.Title>
        <Card.Description>Настройка слотов через classNames на root.</Card.Description>
      </Card.Header>
      <Card.Body>
        <Text variant="small">Пример body-слота с дополнительным отступом сверху.</Text>
      </Card.Body>
      <Card.Footer>
        <Button size="small" variant="outline">
          Настроить
        </Button>
      </Card.Footer>
    </Card>
  );
}
