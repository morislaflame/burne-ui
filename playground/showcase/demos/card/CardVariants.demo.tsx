import { IoArrowForward } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";

export function CardVariantsDemo() {
  return (
    <div className="grid gap-mid sm:grid-cols-2">
      <Card>
        <Card.Header>
          <Card.Title>Default</Card.Title>
          <Card.Description>Базовая карточка с заголовком и описанием.</Card.Description>
        </Card.Header>
      </Card>
      <Card variant="outline">
        <Card.Header>
          <Card.Title>Outline</Card.Title>
          <Card.Description>Только обводка, без заливки.</Card.Description>
        </Card.Header>
      </Card>
      <Card variant="secondary">
        <Card.Header>
          <Card.Title>Secondary</Card.Title>
          <Card.Description>Вторичная поверхность.</Card.Description>
        </Card.Header>
        <Card.Footer className="flex justify-end gap-small">
          <Button variant="ghost" size="small">
            Отмена
          </Button>
          <Button size="small" leftIcon={<IoArrowForward aria-hidden />}>
            Далее
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
