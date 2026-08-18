import { Card } from "@/components/core/Card";

export function CardMotionTitlePopDemo() {
  return (
    <Card pressable className="max-w-xs">
      <Card.Header>
        <Card.Title
          motion={{
            hoverIn: { scale: 1.06, y: -2, duration: 0.22, ease: "back.out(2)" },
            hoverOut: { scale: 1, y: 0, duration: 0.16, ease: "power2.out" },
          }}
        >
          Title pop
        </Card.Title>
        <Card.Description>Only the title slot scales. Card lift stays default.</Card.Description>
      </Card.Header>
    </Card>
  );
}
