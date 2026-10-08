import { IoHelpCircleOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

export function TooltipClassNamesFullDemo() {
  return (
    <Tooltip
      delayShowMs={0}
      status="info"
      side="top"
      classNames={{
        root: "rounded-full ring-2 ring-primary/35",
        trigger: "rounded-full",
        content: "ring-1 ring-primary/25",
        panelRelative: "isolate",
        arrow: "bg-surface border-token-info",
        panel: "border-primary/30",
        indicator: "text-info",
        title: "text-info font-semibold",
        description: "text-muted/80",
      }}
    >
      <Tooltip.Trigger asChild>
        <Button variant="outline" type="button" aria-label="Reference">
          <IoHelpCircleOutline aria-hidden className="icon-mid" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content showArrow>
        <Tooltip.Arrow />
        <Tooltip.Title>Custom slots</Tooltip.Title>
        <Tooltip.Description>
          trigger, root, content, arrow, panel, indicator, title and description through classNames.
        </Tooltip.Description>
      </Tooltip.Content>
    </Tooltip>
  );
}
