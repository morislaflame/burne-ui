import { Card } from "@/components/core/Card";
import { Text } from "@/components/core/Text";

const METRICS = [
  { label: "Активные пользователи", value: "12.4k", delta: "+8%" },
  { label: "Конверсия", value: "3.2%", delta: "+0.4%" },
  { label: "MRR", value: "₽840k", delta: "+12%" },
] as const;

export function CardMetricTilesDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-mid sm:grid-cols-3">
      {METRICS.map((metric) => (
        <Card key={metric.label} variant="secondary">
          <Card.Header>
            <Card.Description>{metric.label}</Card.Description>
            <Card.Title>{metric.value}</Card.Title>
          </Card.Header>
          <Card.Body>
            <Text as="span" variant="tools" className="font-medium text-success">
              {metric.delta}
            </Text>
            <Text as="span" variant="tools" className="text-muted">
              {" "}
              за 30 дней
            </Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
