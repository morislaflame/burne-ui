import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

export function TooltipGlossDemo() {
  return (
    <Tooltip surface="gloss" variant="info">
      <Tooltip.Trigger>
        <Button variant="gloss">Gloss Tooltip</Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Стеклянная подсказка (surface=&quot;gloss&quot;)</Tooltip.Content>
    </Tooltip>
  );
}
