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
          <Popover.Label>Заголовок</Popover.Label>
          <Popover.Hint>Стеклянная всплывающая панель</Popover.Hint>
        </Popover.Header>
        <Popover.Body>
          <Text as="p" variant="small" className="text-muted">
            Контент внутри gloss Popover.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
