import { useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

export function TooltipAsChildMergedPropsDemo() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [refLabel, setRefLabel] = useState("ref: —");

  useLayoutEffect(() => {
    const node = triggerRef.current;
    setRefLabel(node ? `ref → #${node.id} (${node.tagName.toLowerCase()})` : "ref: —");
  }, []);

  return (
    <div className="flex flex-col items-center gap-large">
      <p className="text-sm text-muted">{refLabel}</p>
      <Tooltip delayShowMs={0}>
        <Tooltip.Trigger
          ref={triggerRef}
          id="playground-tooltip-trigger"
          data-analytics="hover-tooltip"
          className="ring-2 ring-primary/30"
        >
          <Button variant="outline" type="button">
            Hover (merged props)
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Tooltip.Title>Merged trigger</Tooltip.Title>
          <Tooltip.Description>
            Host props from Trigger land on the Button child.
          </Tooltip.Description>
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
}
