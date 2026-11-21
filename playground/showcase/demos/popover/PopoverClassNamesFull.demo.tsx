import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverClassNamesFullDemo() {
  return (
    <Popover
      classNames={{
        trigger: "rounded-large ring-2 ring-primary/40",
        content: "ring-1 ring-primary/25",
        panelRelative: "isolate",
        panel: "border-primary/30 bg-surface/95",
        title: "text-primary font-semibold",
        description: "text-muted/80",
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
          <Popover.Title>Display Settings</Popover.Title>
          <Popover.Description>trigger, panel, title and body through classNames</Popover.Description>
        </Popover.Header>
        <Popover.Body>
          <Text as="p" textStyle="small">
            Example of customizing a pop-up panel.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
