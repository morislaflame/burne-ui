import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

export function TooltipGlossDemo() {
  return (
    <Tooltip surface="gloss" variant="info">
      <Tooltip.Trigger>
        <Button variant="gloss">Gloss Tooltip</Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Tooltip.Icon />
        <Tooltip.Title>Справка</Tooltip.Title>
        <Tooltip.Description>
          Стеклянная подсказка с иконкой слева от текста (surface=&quot;gloss&quot;)
        </Tooltip.Description>
      </Tooltip.Content>
    </Tooltip>
  );
}
