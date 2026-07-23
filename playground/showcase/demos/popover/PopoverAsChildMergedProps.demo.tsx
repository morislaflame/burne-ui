import { useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverAsChildMergedPropsDemo() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [refLabel, setRefLabel] = useState("ref: —");

  useLayoutEffect(() => {
    const node = triggerRef.current;
    setRefLabel(node ? `ref → #${node.id} (${node.tagName.toLowerCase()})` : "ref: —");
  }, []);

  return (
    <div className="flex flex-col items-center gap-large">
      <p className="text-sm text-muted">{refLabel}</p>
      <Popover>
        <Popover.Trigger
          ref={triggerRef}
          id="playground-popover-trigger"
          data-analytics="open-popover"
          className="ring-2 ring-primary/30"
        >
          <Button variant="outline" type="button">
            Open (merged props)
          </Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Header>
            <Popover.Title>Merged trigger</Popover.Title>
            <Popover.Description>
              Host props from Trigger land on the Button child.
            </Popover.Description>
          </Popover.Header>
          <Popover.Body>
            <Text as="p" variant="small">
              Inspect the trigger for id / data-analytics / ring.
            </Text>
          </Popover.Body>
        </Popover.Content>
      </Popover>
    </div>
  );
}
