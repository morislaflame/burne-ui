import { useState } from "react";

import {
  AlertDialog,
  primaryButtonVariantForAlertTone,
} from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";

export function AlertDialogUnsavedChangesDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" type="button" onClick={() => setOpen(true)}>
        Leave page
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen} status="warning">
        <AlertDialog.Panel>
          <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Unsaved changes</AlertDialog.Title>
            <AlertDialog.Description>
              If you leave now, your edits to the document will be lost..
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Stay
          </Button>
          <Button
            type="button"
            variant={primaryButtonVariantForAlertTone("warning")}
            status="warning"
            onClick={() => setOpen(false)}
          >
            Leave without saving
          </Button>
        </AlertDialog.Footer>
        </AlertDialog.Panel>
      </AlertDialog>
    </>
  );
}
