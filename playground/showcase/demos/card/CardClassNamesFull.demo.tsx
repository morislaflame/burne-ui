import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { Text } from "@/components/core/Text";

export function CardClassNamesFullDemo() {
  return (
    <Card
      variant="secondary"
      classNames={{
        root: "rounded-large border-info/40 shadow-token-mid",
        header: "gap-large",
        title: "text-info font-semibold",
        description: "text-foreground/75",
        body: "pt-small",
        footer: "border-info/30",
      }}
      className="max-w-md"
    >
      <Card.Header>
        <Card.Title>Notifications</Card.Title>
        <Card.Description>Setting up slots via classNames on root.</Card.Description>
      </Card.Header>
      <Card.Body>
        <Text variant="small">Example body-slots with additional space at the top.</Text>
      </Card.Body>
      <Card.Footer>
        <Button size="small" variant="outline">
          Tune
        </Button>
      </Card.Footer>
    </Card>
  );
}
