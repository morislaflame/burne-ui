import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

const SIZES = ["small", "base", "mid", "large"] as const;

export function PopoverSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-large">
      {SIZES.map((size) => (
        <Popover key={size} size={size}>
          <Popover.Trigger asChild>
            <Button variant="outline" type="button" size={size}>
              {size}
            </Button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Body>
              <Text as="p" variant="small">
                Popover size={size}
              </Text>
            </Popover.Body>
          </Popover.Content>
        </Popover>
      ))}
    </div>
  );
}
