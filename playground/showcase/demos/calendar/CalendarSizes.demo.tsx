import { Calendar } from "@/components/core/Calendar";
import { Text } from "@/components/core/Text";

const SIZES = ["small", "base", "mid", "large"] as const;

export function CalendarSizesDemo() {
  return (
    <div className="flex flex-wrap gap-xlarge">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col items-start gap-small">
          <Text as="span" variant="xsmall" className="font-medium text-muted">
            {size}
          </Text>
          <Calendar size={size} />
        </div>
      ))}
    </div>
  );
}
