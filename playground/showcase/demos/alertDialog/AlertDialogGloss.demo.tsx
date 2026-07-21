import { useState } from "react";

import { AlertDialog, primaryButtonVariantForAlertTone } from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";

export function AlertDialogGlossDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>

      <AlertDialog open={open} onOpenChange={setOpen} variant="gloss" status="danger">
        <AlertDialog.Trigger asChild>
          <Button variant="gloss" status="danger">
            Gloss AlertDialog
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Panel>
          <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Remove element?</AlertDialog.Title>
            <AlertDialog.Description>
              Gloss AlertDialog — confirmation on glass panel.
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button type="button" variant="gloss" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant={primaryButtonVariantForAlertTone("danger")}
            status="danger"
            onClick={() => setOpen(false)}
          >
            Delete
          </Button>
        </AlertDialog.Footer>
        </AlertDialog.Panel>
      </AlertDialog>
    </>
  );
}
