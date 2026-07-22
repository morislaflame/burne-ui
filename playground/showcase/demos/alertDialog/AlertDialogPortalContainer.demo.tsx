import { useState } from "react";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";

export function AlertDialogPortalContainerDemo() {
  const [open, setOpen] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex w-full max-w-lg flex-col gap-mid">
      <p className="text-sm text-muted">
        Custom <code className="text-foreground">portalContainer</code> — alert stays inside the host.
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
          <AlertDialog
            open={open}
            onOpenChange={setOpen}
            portalContainer={container}
            status="warning"
            size="small"
          >
            <AlertDialog.Panel>
              <AlertDialog.Header>
                <AlertDialog.HeadingBlock>
                  <AlertDialog.Title>Inside host</AlertDialog.Title>
                  <AlertDialog.Description>
                    Panel is a DOM child of the dashed container.
                  </AlertDialog.Description>
                </AlertDialog.HeadingBlock>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <Button type="button" size="small" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" size="small" onClick={() => setOpen(false)}>
                  Continue
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Panel>
          </AlertDialog>
        ) : null}
      </div>
    </div>
  );
}
