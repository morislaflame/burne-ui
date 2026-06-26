import { Badge, type BadgePlacement } from "@/components/core/Badge";
import { Text } from "@/components/core/Text";

const PLACEMENTS: BadgePlacement[] = [
  "top-right",
  "top-left",
  "bottom-right",
  "bottom-left",
];

export function BadgePlacementsDemo() {
  return (
    <div className="grid grid-cols-2 gap-xlarge sm:grid-cols-4">
      {PLACEMENTS.map((placement) => (
        <div key={placement} className="flex flex-col items-center gap-base">
          <Badge.Anchor className="box-border h-24 w-24 rounded-mid border-token border-dashed bg-secondary">
            <Badge variant="primary" status="danger" size="base" placement={placement}>
              3
            </Badge>
          </Badge.Anchor>
          <Text as="span" variant="tools" className="text-muted">
            {placement}
          </Text>
        </div>
      ))}
    </div>
  );
}
