import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

export function TooltipMotionInstantLeaveDemo() {
  return (
    <Tooltip delayShowMs={0} motion={{ content: { leave: false } }}>
      <Tooltip.Trigger>
        <Button variant="outline" type="button">
          Instant hide
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Leave is off — unmounts immediately</Tooltip.Content>
    </Tooltip>
  );
}
