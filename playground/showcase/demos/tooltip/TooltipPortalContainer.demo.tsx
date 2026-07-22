import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

export function TooltipPortalContainerDemo() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex w-full max-w-lg flex-col gap-mid">
      <p className="text-sm text-muted">
        Custom <code className="text-foreground">portalContainer</code> — tooltip mounts into the host.
      </p>
      <div
        ref={setContainer}
        className="relative flex h-48 items-center justify-center overflow-hidden rounded-mid border-2 border-dashed border-primary/40 bg-surface/40 p-mid"
      >
        <p className="absolute left-mid top-mid text-xs text-muted">Custom portal host</p>
        {container ? (
          <Tooltip delayShowMs={0} portalContainer={container}>
            <Tooltip.Trigger>
              <Button variant="outline" type="button">
                Hover in host
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Title>Inside host</Tooltip.Title>
              <Tooltip.Description>Portaled into the dashed container.</Tooltip.Description>
            </Tooltip.Content>
          </Tooltip>
        ) : null}
      </div>
    </div>
  );
}
