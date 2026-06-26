import { Expandable } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";

import { EXPANDABLE_INFO_ICON } from "../../shared/constants";

const SIZES = ["small", "base", "mid", "large"] as const;

export function ExpandableSizesDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-small">
      {SIZES.map((size) => (
        <Expandable key={size} size={size} title={`Size ${size}`} icon={EXPANDABLE_INFO_ICON}>
          <Text as="p" variant="small" className="text-muted">
            Expandable size={size}
          </Text>
        </Expandable>
      ))}
    </div>
  );
}
