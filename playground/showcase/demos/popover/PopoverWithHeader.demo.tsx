import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";

export function PopoverWithHeaderDemo() {
  return (
    <Popover side="bottom">
      <Popover.Trigger asChild>
        <Button variant="secondary" type="button">
          With header
        </Button>
      </Popover.Trigger>
      <Popover.Content showArrow>
        <Popover.Arrow />
        <Popover.Header>
          <Popover.Label>Export</Popover.Label>
          <Popover.Hint>Select file format</Popover.Hint>
        </Popover.Header>
        <Popover.Body>
          <div className="flex flex-col gap-xsmall">
            <Button variant="ghost" size="small" type="button">
              PDF
            </Button>
            <Button variant="ghost" size="small" type="button">
              CSV
            </Button>
          </div>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
