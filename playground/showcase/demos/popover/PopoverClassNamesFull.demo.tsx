import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverClassNamesFullDemo() {
  return (
    <Popover
      classNames={{
        root: "rounded-mid ring-2 ring-primary/40",
        trigger: "rounded-mid",
        content: "ring-1 ring-primary/25",
        panel: "border-primary/30 bg-surface/95",
        label: "text-primary font-semibold",
        hint: "text-muted/80",
        body: "text-foreground",
      }}
    >
      <Popover.Trigger asChild>
        <Button variant="outline" type="button">
          Filters
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Header>
          <Popover.Label>Display Settings</Popover.Label>
          <Popover.Hint>root on the trigger, panel/label/body through classNames</Popover.Hint>
        </Popover.Header>
        <Popover.Body>
          <Text as="p" variant="small">
            Example of customizing a pop-up panel.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
