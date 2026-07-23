import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

export function TooltipSidesDemo() {
  return (
    <div className="flex flex-col items-center gap-large py-large">
      <Tooltip side="top">
        <Tooltip.Trigger asChild>
          <Button variant="outline" type="button">
            top
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>side=top</Tooltip.Content>
      </Tooltip>

      <div className="flex items-center gap-large">
        <Tooltip side="left">
          <Tooltip.Trigger asChild>
            <Button variant="outline" type="button">
              left
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>side=left</Tooltip.Content>
        </Tooltip>

        <div className="flex h-control-base min-w-[7rem] items-center justify-center rounded-base border-token bg-secondary px-base">
          <span className="text-small text-muted">anchor</span>
        </div>

        <Tooltip side="right">
          <Tooltip.Trigger asChild>
            <Button variant="outline" type="button">
              right
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>side=right</Tooltip.Content>
        </Tooltip>
      </div>

      <Tooltip side="bottom">
        <Tooltip.Trigger asChild>
          <Button variant="outline" type="button">
            bottom
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>side=bottom</Tooltip.Content>
      </Tooltip>

      
    </div>
  );
}
