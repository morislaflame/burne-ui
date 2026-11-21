import { useLayoutEffect, useRef, useState } from "react";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";

export function AlertDialogAsChildMergedPropsDemo() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [refLabel, setRefLabel] = useState("ref: —");
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const node = triggerRef.current;
    setRefLabel(node ? `ref → #${node.id} (${node.tagName.toLowerCase()})` : "ref: —");
  }, []);

  return (
    <div className="flex flex-col items-center gap-large">
      <p className="text-sm text-muted">{refLabel}</p>
      <AlertDialog open={open} onOpenChange={setOpen} status="danger">
        <AlertDialog.Trigger
          asChild
          ref={triggerRef}
          id="playground-alert-dialog-trigger"
          data-analytics="open-alert-dialog"
          className="ring-2 ring-primary/30"
        >
          <Button type="button" variant="outline">
            Open (merged props)
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Panel>
          <AlertDialog.Header>
            <AlertDialog.HeadingBlock>
              <AlertDialog.Title>Merged trigger</AlertDialog.Title>
              <AlertDialog.Description>
                Host props from Trigger land on the Button child.
              </AlertDialog.Description>
            </AlertDialog.HeadingBlock>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Panel>
      </AlertDialog>
    </div>
  );
}
