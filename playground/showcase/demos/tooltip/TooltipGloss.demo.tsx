import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

export function TooltipGlossDemo() {
  return (
    <Tooltip variant="gloss" status="info">
      <Tooltip.Trigger asChild>
        <Button variant="gloss">Gloss Tooltip</Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Tooltip.Icon />
        <Tooltip.Title>Reference</Tooltip.Title>
        <Tooltip.Description>
          Glass tip with icon to the left of the text (surface=&quot;gloss&quot;)
        </Tooltip.Description>
      </Tooltip.Content>
    </Tooltip>
  );
}
