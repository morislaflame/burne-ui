import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";

export function DialogPortalContainerDemo() {
  const [open, setOpen] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex w-full max-w-lg flex-col gap-mid">
      <p className="text-sm text-muted">
        Custom <code className="text-foreground">portalContainer</code> — overlay fills the host
        (<code className="text-foreground"> show()</code> + <code className="text-foreground">absolute</code>), not the viewport top layer.
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
          <Dialog open={open} onOpenChange={setOpen} portalContainer={container} size="small">
            <Dialog.Panel>
              <Dialog.Header>
                <Dialog.HeadingBlock>
                  <Dialog.Title>Inside host</Dialog.Title>
                  <Dialog.Description>
                    Panel is a DOM child of the dashed container.
                  </Dialog.Description>
                </Dialog.HeadingBlock>
                <Dialog.Close />
              </Dialog.Header>
              <Dialog.Body>
                <p className="text-sm text-muted">
                  Useful for shadow roots, iframes, and nested scroll regions.
                </p>
              </Dialog.Body>
              <Dialog.Footer>
                <Button type="button" size="small" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </Dialog.Footer>
            </Dialog.Panel>
          </Dialog>
        ) : null}
      </div>
    </div>
  );
}
