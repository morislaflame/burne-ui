import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";

export function CardGlossDemo() {
  return (
    <Card variant="gloss" className="max-w-sm">
      <Card.Header>
        <Card.Title>Gloss</Card.Title>
        <Card.Description>Glass panel with conic-stroke.</Card.Description>
      </Card.Header>
      <Card.Footer className="flex justify-end gap-small">
        <Button variant="gloss" size="small">
          Gloss
        </Button>
        <Button variant="primary" size="small">
          Primary
        </Button>
      </Card.Footer>
    </Card>
  );
}
