import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverGlossDemo() {
  return (
    <Popover variant="gloss">
      <Popover.Trigger>
        <Button variant="gloss">Gloss Popover</Button>
      </Popover.Trigger>
      <Popover.Content showArrow>
        <Popover.Header>
          <Popover.Label>Heading</Popover.Label>
          <Popover.Hint>Glass pop-up panel</Popover.Hint>
        </Popover.Header>
        <Popover.Body>
          <Text as="p" variant="small" className="text-muted">
            Content inside gloss Popover.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
