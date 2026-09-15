import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverMotionDefaultDemo() {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="outline" type="button">
          Default
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Body>
          <Text as="p" variant="small">
            Scale in, fade out — kit portalSurface recipes.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
