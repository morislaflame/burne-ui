import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

export function TooltipMotionDefaultDemo() {
  return (
    <Tooltip delayShowMs={0}>
      <Tooltip.Trigger>
        <Button variant="outline" type="button">
          Default
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Scale in, fade out</Tooltip.Content>
    </Tooltip>
  );
}
