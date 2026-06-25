import { Badge } from "@/components/core/Badge";
import { Text } from "@/components/core/Text";

const ROWS = [
  { name: "API Gateway", status: "success" as const, label: "Online" },
  { name: "Worker queue", status: "warning" as const, label: "Degraded" },
  { name: "Legacy cron", status: "danger" as const, label: "Down" },
] as const;

export function BadgeServiceStatusListDemo() {
  return (
    <ul className="flex w-full max-w-md flex-col gap-small">
      {ROWS.map((row) => (
        <li
          key={row.name}
          className="flex items-center justify-between gap-mid rounded-mid border-token bg-secondary px-mid py-small"
        >
          <Text as="span" variant="small" className="font-medium">
            {row.name}
          </Text>
          <Badge status={row.status} size="small" className="tracking-wide">
            {row.label}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
