import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

const SIZES = ["small", "base", "mid", "large"] as const;

export function TooltipSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-mid">
      {SIZES.map((size) => (
        <Tooltip key={size} size={size}>
          <Tooltip.Trigger>
            <Button variant="outline" type="button" size={size}>
              {size}
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Title>size={size}</Tooltip.Title>
            <Tooltip.Description>
              Hint with different padding, typography and panel width.
            </Tooltip.Description>
          </Tooltip.Content>
        </Tooltip>
      ))}
    </div>
  );
}
