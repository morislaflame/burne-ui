import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverSidesDemo() {
  return (
    <div className="flex flex-col items-center gap-large py-large">
      <Popover side="top">
        <Popover.Trigger asChild>
          <Button variant="outline" type="button">
            top
          </Button>
        </Popover.Trigger>
        <Popover.Content showArrow>
          <Popover.Body>
            <Text as="p" variant="small">
              side=top
            </Text>
          </Popover.Body>
        </Popover.Content>
      </Popover>

      <div className="flex items-center gap-large">
        <Popover side="left">
          <Popover.Trigger asChild>
            <Button variant="outline" type="button">
              left
            </Button>
          </Popover.Trigger>
          <Popover.Content showArrow>
            <Popover.Body>
              <Text as="p" variant="small">
                side=left
              </Text>
            </Popover.Body>
          </Popover.Content>
        </Popover>

        <div className="flex h-control-base min-w-[7rem] items-center justify-center rounded-base border-token bg-secondary px-base">
          <Text as="span" variant="small" className="text-muted">
            anchor
          </Text>
        </div>

        <Popover side="right">
          <Popover.Trigger asChild>
            <Button variant="outline" type="button">
              right
            </Button>
          </Popover.Trigger>
          <Popover.Content showArrow>
            <Popover.Body>
              <Text as="p" variant="small">
                side=right
              </Text>
            </Popover.Body>
          </Popover.Content>
        </Popover>
      </div>

      <Popover side="bottom">
        <Popover.Trigger asChild>
          <Button variant="outline" type="button">
            bottom
          </Button>
        </Popover.Trigger>
        <Popover.Content showArrow>
          <Popover.Body>
            <Text as="p" variant="small">
              side=bottom
            </Text>
          </Popover.Body>
        </Popover.Content>
      </Popover>

      
    </div>
  );
}
