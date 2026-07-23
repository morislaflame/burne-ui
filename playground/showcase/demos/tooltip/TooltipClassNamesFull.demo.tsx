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
        arrow: "bg-surface-tint-info",
        panel: "border-primary/30",
        indicator: "text-primary",
        title: "text-primary font-semibold",
        description: "text-muted/80",
      }}
    >
      <Tooltip.Trigger asChild>
        <Button variant="outline" type="button" aria-label="Reference">
          <IoHelpCircleOutline aria-hidden className="icon-plus" />
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

export function TooltipClassNamesGlossDemo() {
  return (
    <Tooltip
      delayShowMs={0}
      variant="gloss"
      side="bottom"
      classNames={{
        glossPanel: "ring-1 ring-white/10",
        glossContent: "gap-y-xsmall",
        panel: "ring-1 ring-white/10",
        title: "text-foreground/95",
      }}
    >
      <Tooltip.Trigger asChild>
        <Button variant="secondary" type="button">
          Gloss tooltip
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content showArrow>
        <Tooltip.Arrow />
        Glass tip with custom glossContent
      </Tooltip.Content>
    </Tooltip>
  );
}
