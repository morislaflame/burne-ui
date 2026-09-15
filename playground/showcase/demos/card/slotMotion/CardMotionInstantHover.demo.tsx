import { Card } from "@/components/core/Card";

export function CardMotionInstantHoverDemo() {
  return (
    <Card
      pressable
      className="max-w-xs"
      motion={{ root: { hoverIn: false, hoverOut: false } }}
    >
      <Card.Header>
        <Card.Title>Instant hover</Card.Title>
        <Card.Description>Lift is skipped. Press squeeze stays.</Card.Description>
      </Card.Header>
    </Card>
  );
}
