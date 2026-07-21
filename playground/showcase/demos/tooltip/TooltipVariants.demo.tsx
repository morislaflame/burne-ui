import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

export function TooltipVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-mid">
      <Tooltip variant="default">
        <Tooltip.Trigger asChild>
          <Button variant="outline" type="button">
            Default
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Hint on hover and focus</Tooltip.Content>
      </Tooltip>
      <Tooltip status="success" side="top">
        <Tooltip.Trigger asChild>
          <Button variant="outline" type="button">
            Success
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Operation completed</Tooltip.Content>
      </Tooltip>
      <Tooltip status="danger" size="small">
        <Tooltip.Trigger asChild>
          <Button variant="outline" type="button" size="small">
            Danger
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>The action is irreversible</Tooltip.Content>
      </Tooltip>
      <Tooltip status="info">
        <Tooltip.Trigger asChild>
          <Button variant="outline" type="button">
            Info
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Additional information</Tooltip.Content>
      </Tooltip>
      <Tooltip status="warning">
        <Tooltip.Trigger asChild>
          <Button variant="outline" type="button">
            Warning
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Check your settings</Tooltip.Content>
      </Tooltip>
    </div>
  );
}
