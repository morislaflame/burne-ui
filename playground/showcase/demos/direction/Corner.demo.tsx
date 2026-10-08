import { Badge } from "@/components/core/Badge";
import { Text } from "@/components/core/Text";

import { RtlPair } from "./rtlPair";

export function DirectionCornerDemo() {
  return (
    <RtlPair>
      {() => (
        <div className="flex flex-col items-center gap-small">
          <Badge.Anchor className="h-24 w-24 rounded-mid border-token bg-surface">
            <Badge placement="top-right" variant="primary">
              3
            </Badge>
          </Badge.Anchor>
          <Text variant="small" className="text-muted">
            placement=&quot;top-right&quot;
          </Text>
        </div>
      )}
    </RtlPair>
  );
}
