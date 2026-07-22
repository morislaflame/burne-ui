import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";

export function DrawerPortalContainerDemo() {
  const [open, setOpen] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex w-full max-w-lg flex-col gap-mid">
      <p className="text-sm text-muted">
        Custom <code className="text-foreground">portalContainer</code> — drawer stays inside the host.
      </p>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        Open in custom host
      </Button>
      <div
        ref={setContainer}
        className="relative h-72 overflow-hidden rounded-mid border-2 border-dashed border-primary/40 bg-surface/40 p-mid"
      >
        <p className="text-xs text-muted">Custom portal host</p>
        {container ? (
          <Drawer open={open} onOpenChange={setOpen} portalContainer={container} placement="right">
            <Drawer.Panel extent="default">
              <Drawer.Header>
                <Drawer.HeadingBlock>
                  <Drawer.Title>Inside host</Drawer.Title>
                  <Drawer.Description>Panel is a DOM child of the dashed container.</Drawer.Description>
                </Drawer.HeadingBlock>
                <Drawer.Close />
              </Drawer.Header>
              <Drawer.Body>
                <p className="text-sm text-muted">Useful for nested shells and scroll regions.</p>
              </Drawer.Body>
              <Drawer.Footer>
                <Button type="button" size="small" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </Drawer.Footer>
            </Drawer.Panel>
          </Drawer>
        ) : null}
      </div>
    </div>
  );
}
