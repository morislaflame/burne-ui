import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverPortalContainerDemo() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex w-full max-w-lg flex-col gap-mid">
      <p className="text-sm text-muted">
        Custom <code className="text-foreground">portalContainer</code> — panel mounts into the host.
      </p>
      <div
        ref={setContainer}
        className="relative flex h-64 items-start justify-center overflow-hidden rounded-mid border-2 border-dashed border-primary/40 bg-surface/40 p-mid"
      >
        <p className="absolute left-mid top-mid text-xs text-muted">Custom portal host</p>
        {container ? (
          <Popover portalContainer={container}>
            <Popover.Trigger>
              <Button variant="outline" type="button">
                Open in host
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <Popover.Body>
                <Text as="p" variant="small">
                  Portaled into the dashed container.
                </Text>
              </Popover.Body>
            </Popover.Content>
          </Popover>
        ) : null}
      </div>
    </div>
  );
}
