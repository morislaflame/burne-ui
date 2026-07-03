import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverSimpleDemo() {
  return (
    <Popover>
      <Popover.Trigger>
        <Button variant="outline" type="button">
          Popover
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Body>
          <Text as="p" variant="small">
            Trigger click panel.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
