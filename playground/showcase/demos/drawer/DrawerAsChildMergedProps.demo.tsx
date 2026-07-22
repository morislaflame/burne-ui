import { useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";

export function DrawerAsChildMergedPropsDemo() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [refLabel, setRefLabel] = useState("ref: —");

  useLayoutEffect(() => {
    const node = triggerRef.current;
    setRefLabel(node ? `ref → #${node.id} (${node.tagName.toLowerCase()})` : "ref: —");
  }, []);

  return (
    <div className="flex flex-col items-center gap-mid">
      <p className="text-sm text-muted">{refLabel}</p>
      <Drawer>
        <Drawer.Trigger
          asChild
          ref={triggerRef}
          id="playground-drawer-trigger"
          data-analytics="open-drawer"
          className="ring-2 ring-primary/30"
        >
          <Button type="button" variant="outline">
            Open (merged props)
          </Button>
        </Drawer.Trigger>
        <Drawer.Panel>
          <Drawer.Header>
            <Drawer.HeadingBlock>
              <Drawer.Title>Merged trigger</Drawer.Title>
              <Drawer.Description>
                Host props from Trigger land on the Button child.
              </Drawer.Description>
            </Drawer.HeadingBlock>
            <Drawer.Close />
          </Drawer.Header>
          <Drawer.Body>
            <p className="text-sm text-muted">Opened via asChild trigger with forwarded props.</p>
          </Drawer.Body>
        </Drawer.Panel>
      </Drawer>
    </div>
  );
}
