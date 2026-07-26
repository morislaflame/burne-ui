import { Card, type CardSize } from "@/components/core/Card";
import { Text } from "@/components/core/Text";

const SIZES: CardSize[] = ["small", "base", "mid", "large"];

export function CardSizesDemo() {
  return (
    <div className="grid w-full gap-mid sm:grid-cols-2 lg:grid-cols-4">
      {SIZES.map((size) => (
        <Card key={size} size={size}>
          <Card.Header>
            <Card.Title>size={size}</Card.Title>
            <Card.Description>
              Radius matches Button; padding and type scale with size.
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <Text variant="small">Body content</Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
