import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverMotionInstantLeaveDemo() {
  return (
    <Popover motion={{ content: { leave: false } }}>
      <Popover.Trigger asChild>
        <Button variant="outline" type="button">
          Instant leave
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Body>
          <Text as="p" variant="small">
            Enter keeps the kit recipe. Leave unmounts immediately.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
